from pathlib import Path

from editorial_runtime.config import load_capability_routes, resolve_capability_model
from editorial_runtime.models import PersonaName, WorkflowStage
from editorial_runtime.registry import peek_next_article_id
from editorial_runtime.repo import find_repo_root
from editorial_runtime.workflow import run_workflow


def test_load_capability_routes():
    root = find_repo_root(Path(__file__).resolve().parents[2])
    routes = load_capability_routes(root)
    assert "writer" in routes
    assert ":" in routes["writer"].primary


def test_peek_next_article_id():
    root = find_repo_root(Path(__file__).resolve().parents[2])
    article_id = peek_next_article_id(root)
    assert article_id.startswith("PS-")


def test_test_model_workflow_reaches_human_gate():
    root = Path(__file__).resolve().parents[2]
    runs_dir = root / "editorial-runtime" / "runs" / "test-llm"
    state = run_workflow(
        topic="MCP for platform engineers",
        persona=PersonaName.maya,
        dry_run=False,
        use_test_model=True,
        runs_dir=runs_dir,
    )
    assert state.stage == WorkflowStage.human_gate
    assert state.desk_decision is not None
    assert state.brief is not None
    assert len(state.model_usage) >= 2
    agents = {record.agent for record in state.model_usage}
    assert "author" in agents
    assert "evidence" in agents
