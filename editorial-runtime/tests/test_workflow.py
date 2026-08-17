from pathlib import Path

from editorial_runtime.models import PersonaName, WorkflowStage
from editorial_runtime.workflow import run_workflow


def test_dry_run_reaches_human_gate():
    root = Path(__file__).resolve().parents[2]
    runs_dir = root / "editorial-runtime" / "runs" / "test"
    state = run_workflow(
        topic="MCP for platform engineers",
        persona=PersonaName.maya,
        dry_run=True,
        runs_dir=runs_dir,
    )
    assert state.stage == WorkflowStage.human_gate
    assert state.human_status == "pending"
    assert state.brief is not None
    assert state.draft_path is not None
    assert Path(state.draft_path).is_file()
