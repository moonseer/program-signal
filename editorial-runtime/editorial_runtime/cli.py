"""CLI for the editorial runtime."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from dotenv import load_dotenv

from editorial_runtime.config import llm_credentials_available
from editorial_runtime.context import assemble_author_context
from editorial_runtime.models import PersonaName, WorkflowStage
from editorial_runtime.repo import find_repo_root
from editorial_runtime.store import open_run_store
from editorial_runtime.workflow import decide_workflow, revise_workflow, run_workflow


def _load_env(repo: Path) -> None:
    load_dotenv(repo / "editorial-runtime" / ".env")
    base = os.getenv("OPENAI_API_BASE")
    if base and not os.getenv("OPENAI_BASE_URL"):
        os.environ["OPENAI_BASE_URL"] = base


def main() -> None:
    parser = argparse.ArgumentParser(prog="ps-editorial")
    sub = parser.add_subparsers(dest="command", required=True)

    run = sub.add_parser("run", help="Run editorial workflow")
    run.add_argument("--topic", required=True)
    run.add_argument("--persona", choices=[p.value for p in PersonaName], default="maya")
    run.add_argument(
        "--dry-run",
        action="store_true",
        help="Stub LLM nodes (default when neither --live nor --test-model)",
    )
    run.add_argument(
        "--live",
        action="store_true",
        help="Call configured LLM providers (requires API keys)",
    )
    run.add_argument(
        "--test-model",
        action="store_true",
        help="Use pydantic-ai test model (no API keys; exercises LLM wiring)",
    )
    run.add_argument(
        "--brief",
        type=Path,
        default=None,
        help="Existing Desk brief YAML (skips generating a new brief)",
    )
    run.add_argument(
        "--source",
        action="append",
        default=[],
        help="Approved source id (repeatable). Default SRC-MCP-001",
    )
    run.add_argument(
        "--max-revisions",
        type=int,
        default=1,
        help="Author rewrites after Evidence PASS WITH CHANGES (default 1)",
    )

    ctx = sub.add_parser("assemble-context", help="Render Author Engine context")
    ctx.add_argument("--persona", choices=[p.value for p in PersonaName], required=True)
    ctx.add_argument("--brief", type=Path, required=True)
    ctx.add_argument("--evidence", type=Path, default=None)

    show = sub.add_parser("show", help="Load a persisted workflow run")
    show.add_argument("workflow_id")

    listing = sub.add_parser("list", help="List persisted workflow runs")
    listing.add_argument("--stage", default=None, help="Filter by stage (e.g. human_gate)")
    listing.add_argument("--limit", type=int, default=20)

    revise = sub.add_parser("revise", help="Rewrite a human-gate run, then Evidence again")
    revise.add_argument("workflow_id")
    revise.add_argument(
        "--note",
        required=True,
        help="Human Editor-in-Chief revision notes for the Author Engine",
    )

    decide = sub.add_parser("decide", help="Accept or reject a human-gate run (does not publish)")
    decide.add_argument("workflow_id")
    decide.add_argument("--accept", action="store_true")
    decide.add_argument("--reject", action="store_true")
    decide.add_argument("--note", default="")

    desk = sub.add_parser("desk", help="Local Editor-in-Chief review UI (127.0.0.1)")
    desk.add_argument("--port", type=int, default=8787)

    args = parser.parse_args()
    repo = find_repo_root()
    _load_env(repo)
    runs_dir = repo / "editorial-runtime" / "runs"

    if args.command == "run":
        dry_run = not args.live and not args.test_model
        if args.live and not llm_credentials_available():
            raise SystemExit(
                " --live requires provider credentials (e.g. OPENAI_API_KEY). "
                "Use --test-model to exercise wiring without keys.",
            )

        brief_path = args.brief
        if brief_path and not brief_path.is_absolute():
            brief_path = (repo / brief_path).resolve()
        store = open_run_store(runs_dir=runs_dir)
        state = run_workflow(
            topic=args.topic,
            persona=PersonaName(args.persona),
            dry_run=dry_run,
            use_test_model=args.test_model,
            runs_dir=runs_dir,
            brief_path=brief_path,
            source_ids=args.source or ["SRC-MCP-001"],
            max_revisions=args.max_revisions,
            store=store,
        )
        print(json.dumps(state.model_dump(mode="json"), indent=2, default=str))
        if state.stage != WorkflowStage.human_gate:
            raise SystemExit(f"Expected human_gate, got {state.stage}")
        return

    if args.command == "show":
        store = open_run_store(runs_dir=runs_dir)
        state = store.get(args.workflow_id)
        if state is None:
            raise SystemExit(f"No run found: {args.workflow_id}")
        print(json.dumps(state.model_dump(mode="json"), indent=2, default=str))
        return

    if args.command == "list":
        store = open_run_store(runs_dir=runs_dir)
        rows = store.list(stage=args.stage, limit=args.limit)
        print(
            json.dumps(
                [
                    {
                        "workflow_id": row.workflow_id,
                        "stage": row.stage.value,
                        "topic": row.topic,
                        "persona": row.assigned_persona.value,
                        "human_status": row.human_status,
                        "article_id": row.brief.article_id if row.brief else None,
                        "updated_at": row.updated_at.isoformat(),
                    }
                    for row in rows
                ],
                indent=2,
            ),
        )
        return

    if args.command == "revise":
        store = open_run_store(runs_dir=runs_dir)
        try:
            state = revise_workflow(
                workflow_id=args.workflow_id,
                runs_dir=runs_dir,
                notes=args.note,
                store=store,
            )
        except ValueError as exc:
            raise SystemExit(str(exc)) from exc
        print(json.dumps(state.model_dump(mode="json"), indent=2, default=str))
        if state.stage != WorkflowStage.human_gate:
            raise SystemExit(f"Expected human_gate, got {state.stage}")
        return

    if args.command == "decide":
        if args.accept == args.reject:
            raise SystemExit("Pass exactly one of --accept or --reject")
        store = open_run_store(runs_dir=runs_dir)
        try:
            state = decide_workflow(
                workflow_id=args.workflow_id,
                decision="approved" if args.accept else "rejected",
                runs_dir=runs_dir,
                notes=args.note,
                store=store,
            )
        except ValueError as exc:
            raise SystemExit(str(exc)) from exc
        print(json.dumps(state.model_dump(mode="json"), indent=2, default=str))
        return

    if args.command == "desk":
        from editorial_runtime.desk import serve_desk

        store = open_run_store(runs_dir=runs_dir)
        serve_desk(store=store, runs_dir=runs_dir, port=args.port)
        return

    if args.command == "assemble-context":
        text = assemble_author_context(
            persona=PersonaName(args.persona),
            brief_path=args.brief,
            evidence_path=args.evidence,
            root=repo,
        )
        print(text)
        return


if __name__ == "__main__":
    main()
