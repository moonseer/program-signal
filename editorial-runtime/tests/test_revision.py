from editorial_runtime.models import EvidenceOutcome, EvidenceReview, PersonaName, WorkflowState
from editorial_runtime.nodes import route_after_evidence
from editorial_runtime.sources import load_source_pack
from editorial_runtime.repo import find_repo_root
from pathlib import Path


def test_load_source_pack_includes_mcp_spec():
    root = find_repo_root(Path(__file__).resolve().parents[2])
    pack = load_source_pack(["SRC-MCP-001"], root=root)
    assert "SRC-MCP-001" in pack
    assert "modelcontextprotocol.io" in pack


def test_revision_cap_sends_hold_to_human_gate():
    state = WorkflowState(
        workflow_id="test",
        topic="MCP",
        assigned_persona=PersonaName.maya,
        revision_count=1,
        max_revisions=1,
        evidence_review=EvidenceReview(
            editor_status=EvidenceOutcome.pass_with_changes,
            confidence=50,
            summary="needs sources",
        ),
    )
    assert route_after_evidence(state) == "human_gate"


def test_first_pass_with_changes_routes_to_revision():
    state = WorkflowState(
        workflow_id="test",
        topic="MCP",
        assigned_persona=PersonaName.maya,
        revision_count=0,
        max_revisions=1,
        evidence_review=EvidenceReview(
            editor_status=EvidenceOutcome.pass_with_changes,
            confidence=50,
            summary="needs sources",
        ),
    )
    assert route_after_evidence(state) == "revision"
