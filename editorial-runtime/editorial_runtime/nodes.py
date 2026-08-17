"""LangGraph workflow nodes (Phase 1 — dry-run capable)."""

from __future__ import annotations

import uuid
from pathlib import Path

from editorial_runtime.models import (
    ArticleBrief,
    ContentType,
    EditorialDecision,
    EditorialDecisionStatus,
    EvidenceOutcome,
    EvidenceReview,
    PersonaName,
    WorkflowStage,
    WorkflowState,
)


def desk_review(state: WorkflowState) -> WorkflowState:
    state.stage = WorkflowStage.desk
    state.desk_decision = EditorialDecision(
        status=EditorialDecisionStatus.APPROVE,
        reason=(
            "Dry-run approval: topic fits Platform Signal platform-engineering mission."
            if state.dry_run
            else "Desk review pending LLM integration."
        ),
        content_type=ContentType.explainer,
        author_persona=state.assigned_persona,
        central_thesis=f"Platform Signal should explain {state.topic} with evidence and clear boundaries.",
        research_review="strongly_recommended",
    )
    state.touch()
    return state


def create_brief(state: WorkflowState) -> WorkflowState:
    if state.desk_decision is None:
        state.errors.append("desk_decision missing before brief")
        return state

    decision = state.desk_decision
    if decision.status in {EditorialDecisionStatus.REJECT, EditorialDecisionStatus.WATCH}:
        state.errors.append(f"Desk returned {decision.status}; brief not created.")
        return state

    article_id = f"PS-{int(uuid.uuid4().int % 1_000_000):06d}"
    state.brief = ArticleBrief(
        article_id=article_id,
        working_title=state.topic.title(),
        content_type=decision.content_type,
        author_persona=decision.author_persona,
        secondary_perspective=decision.secondary_perspective,
        target_reader=["platform engineers", "staff engineers"],
        primary_question=f"What should platform engineers know about {state.topic}?",
        reader_problem="Teams lack a shared, operable definition.",
        central_thesis=decision.central_thesis,
        why_now="Emerging production adoption without operational vocabulary.",
        unique_angle="Translate protocol and architecture into platform ownership.",
        required_sections=[
            "why this matters",
            "protocol vs product",
            "production considerations",
            "recommendation",
        ],
        claims_to_verify=["Primary claims require tier-1 sources."],
        required_visuals=["architecture or boundary diagram"],
        target_length=1800,
        research_review=decision.research_review,
        editorial_decision=decision.status,
    )
    state.stage = WorkflowStage.brief
    state.touch()
    return state


def author_outline(state: WorkflowState) -> WorkflowState:
    if state.brief is None:
        state.errors.append("brief missing before outline")
        return state
    sections = "\n".join(f"- {section}" for section in state.brief.required_sections)
    state.outline = (
        f"# Outline: {state.brief.working_title}\n\n"
        f"Persona: {state.brief.author_persona.value}\n\n"
        f"{sections}\n"
    )
    state.stage = WorkflowStage.author_outline
    state.touch()
    return state


def author_draft(state: WorkflowState, runs_dir: Path) -> WorkflowState:
    if state.brief is None:
        state.errors.append("brief missing before draft")
        return state
    runs_dir.mkdir(parents=True, exist_ok=True)
    draft_path = runs_dir / f"{state.workflow_id}-draft.mdx"
    draft_path.write_text(
        (
            f"---\n"
            f"title: {state.brief.working_title}\n"
            f"---\n\n"
            f"<!-- Phase 1 placeholder draft for {state.brief.article_id} -->\n\n"
            f"{state.outline or ''}\n"
        ),
        encoding="utf-8",
    )
    state.draft_path = str(draft_path)
    state.stage = WorkflowStage.author_draft
    state.touch()
    return state


def evidence_review(state: WorkflowState) -> WorkflowState:
    state.evidence_review = EvidenceReview(
        editor_status=EvidenceOutcome.pass_ if state.dry_run else EvidenceOutcome.hold,
        confidence=75 if state.dry_run else 0,
        summary=(
            "Dry-run PASS: evidence review deferred until Evidence Editor LLM is wired."
            if state.dry_run
            else "Evidence review requires LLM integration."
        ),
    )
    state.stage = WorkflowStage.evidence
    state.touch()
    return state


def route_after_evidence(state: WorkflowState) -> str:
    if state.evidence_review is None:
        return "human_gate"
    if state.evidence_review.editor_status == EvidenceOutcome.pass_with_changes:
        return "revision"
    if state.evidence_review.editor_status == EvidenceOutcome.hold:
        return "human_gate"
    if state.evidence_review.editor_status == EvidenceOutcome.fail:
        return "human_gate"
    return "human_gate"


def revision(state: WorkflowState) -> WorkflowState:
    state.stage = WorkflowStage.revision
    state.touch()
    return state


def human_gate(state: WorkflowState) -> WorkflowState:
    state.stage = WorkflowStage.human_gate
    state.human_status = "pending"
    state.touch()
    return state
