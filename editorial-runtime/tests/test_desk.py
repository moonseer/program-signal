from editorial_runtime.desk import inbox, render_index, render_run
from editorial_runtime.models import (
    ArticleBrief,
    ContentType,
    EvidenceOutcome,
    EvidenceReview,
    PersonaName,
    WorkflowStage,
    WorkflowState,
)
from editorial_runtime.store import InMemoryRunStore
from editorial_runtime.workflow import decide_workflow
import pytest


def _brief() -> ArticleBrief:
    return ArticleBrief(
        article_id="PS-000010",
        opportunity_id="PS-O-0010",
        working_title="What Is Agentic Platform Engineering?",
        content_type=ContentType.explainer,
        author_persona=PersonaName.maya,
        target_reader=["platform engineers"],
        primary_question="What stays human?",
        reader_problem="Undefined term.",
        central_thesis="Agents may assist. They must not own the control plane.",
        why_now="Rebranding.",
        unique_angle="Human jobs.",
        required_sections=["why this matters"],
        target_length=1600,
        research_review="strongly_recommended",
    )


def _run(*, status: str = "pending") -> WorkflowState:
    return WorkflowState(
        workflow_id="desk-1",
        topic="What Is Agentic Platform Engineering?",
        assigned_persona=PersonaName.maya,
        brief=_brief(),
        draft_mdx="## At a Glance\nA short stub.\n",
        stage=WorkflowStage.human_gate,
        human_status=status,  # type: ignore[arg-type]
        evidence_review=EvidenceReview(
            editor_status=EvidenceOutcome.hold,
            confidence=60,
            summary="Stub length.",
        ),
    )


def test_inbox_lists_pending_before_decided():
    store = InMemoryRunStore()
    pending = _run()
    decided = _run()
    decided.workflow_id = "desk-2"
    decided.human_status = "rejected"
    store.save(pending)
    store.save(decided)
    rows = inbox(store)
    assert rows[0].workflow_id == "desk-1"
    assert rows[1].workflow_id == "desk-2"


def test_render_run_includes_draft_and_does_not_claim_publish():
    page = render_run(_run()).decode("utf-8")
    assert "A short stub" in page
    assert "does not publish" in page.lower() or "This does not publish" in page
    assert "Accept" in page
    assert "Reject" in page


def test_render_index_empty():
    page = render_index([]).decode("utf-8")
    assert "No human-gate runs" in page


def test_decide_accept_and_reject(tmp_path):
    store = InMemoryRunStore()
    store.save(_run())
    accepted = decide_workflow(
        workflow_id="desk-1",
        decision="approved",
        runs_dir=tmp_path,
        notes="Ship after copyedit",
        store=store,
    )
    assert accepted.human_status == "approved"
    assert accepted.human_notes == "Ship after copyedit"
    assert accepted.stage == WorkflowStage.human_gate


def test_decide_rejects_unknown_run_and_bad_decision(tmp_path):
    store = InMemoryRunStore()
    with pytest.raises(ValueError, match="No run found"):
        decide_workflow(
            workflow_id="missing",
            decision="approved",
            runs_dir=tmp_path,
            store=store,
        )
    store.save(_run())
    with pytest.raises(ValueError, match="approved or rejected"):
        decide_workflow(
            workflow_id="desk-1",
            decision="publish",
            runs_dir=tmp_path,
            store=store,
        )
