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
from editorial_runtime.workflow import run_workflow


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

    ctx = sub.add_parser("assemble-context", help="Render Author Engine context")
    ctx.add_argument("--persona", choices=[p.value for p in PersonaName], required=True)
    ctx.add_argument("--brief", type=Path, required=True)
    ctx.add_argument("--evidence", type=Path, default=None)

    args = parser.parse_args()
    repo = find_repo_root()
    _load_env(repo)

    if args.command == "run":
        dry_run = not args.live and not args.test_model
        if args.live and not llm_credentials_available():
            raise SystemExit(
                " --live requires provider credentials (e.g. OPENAI_API_KEY). "
                "Use --test-model to exercise wiring without keys.",
            )

        runs_dir = repo / "editorial-runtime" / "runs"
        state = run_workflow(
            topic=args.topic,
            persona=PersonaName(args.persona),
            dry_run=dry_run,
            use_test_model=args.test_model,
            runs_dir=runs_dir,
        )
        print(json.dumps(state.model_dump(mode="json"), indent=2, default=str))
        if state.stage != WorkflowStage.human_gate:
            raise SystemExit(f"Expected human_gate, got {state.stage}")
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
