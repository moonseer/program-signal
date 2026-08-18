from pathlib import Path

from editorial_runtime.models import PersonaName, WorkflowStage
from editorial_runtime.store import JsonFileRunStore
from editorial_runtime.workflow import run_workflow


def test_dry_run_reaches_human_gate():
    root = Path(__file__).resolve().parents[2]
    runs_dir = root / "editorial-runtime" / "runs" / "test"
    store = JsonFileRunStore(runs_dir)
    state = run_workflow(
        topic="MCP for platform engineers",
        persona=PersonaName.maya,
        dry_run=True,
        runs_dir=runs_dir,
        store=store,
    )
    assert state.stage == WorkflowStage.human_gate
    assert state.human_status == "pending"
    assert state.brief is not None
    assert state.draft_path is not None
    assert state.draft_mdx is not None
    assert (runs_dir / f"{state.workflow_id}.json").is_file()


def test_existing_brief_skips_generated_brief():
    root = Path(__file__).resolve().parents[2]
    runs_dir = root / "editorial-runtime" / "runs" / "test-brief"
    state = run_workflow(
        topic="MCP for platform engineers",
        persona=PersonaName.maya,
        dry_run=True,
        runs_dir=runs_dir,
        brief_path=root / "editorial" / "briefs" / "PS-000008.yml",
        source_ids=["SRC-MCP-001"],
        max_revisions=1,
        store=JsonFileRunStore(runs_dir),
    )
    assert state.brief is not None
    assert state.brief.article_id == "PS-000008"
    assert state.stage == WorkflowStage.human_gate
