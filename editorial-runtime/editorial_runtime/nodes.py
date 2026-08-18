"""LangGraph workflow nodes — dry-run stubs or PydanticAI agents."""

from __future__ import annotations

import uuid
from pathlib import Path

from editorial_runtime.context import load_brief
from editorial_runtime.config import llm_credentials_available
from editorial_runtime.models import (
    ArticleBrief,
    ContentType,
    EditorialDecision,
    EditorialDecisionStatus,
    EvidenceOutcome,
    EvidenceReview,
    WorkflowStage,
    WorkflowState,
)


def _use_llm(state: WorkflowState) -> bool:
    return not state.dry_run and (state.use_test_model or llm_credentials_available())


def desk_review(state: WorkflowState) -> WorkflowState:
    state.stage = WorkflowStage.desk
    if state.brief_path:
        state.desk_decision = EditorialDecision(
            status=EditorialDecisionStatus.APPROVE,
            reason=f"Using existing brief {state.brief_path}",
            content_type=ContentType.explainer,
            author_persona=state.assigned_persona,
            central_thesis=state.topic,
            research_review="strongly_recommended",
        )
        state.touch()
        return state

    if _use_llm(state):
        from editorial_runtime.agents.desk import run_desk_decision

        try:
            state.desk_decision = run_desk_decision(state)
        except Exception as exc:  # noqa: BLE001 — surface agent failures on workflow state
            state.errors.append(f"desk LLM failed: {exc}")
            state.desk_decision = _desk_stub(state)
    else:
        state.desk_decision = _desk_stub(state)
    state.touch()
    return state


def _desk_stub(state: WorkflowState) -> EditorialDecision:
    return EditorialDecision(
        status=EditorialDecisionStatus.APPROVE,
        reason=(
            "Dry-run approval: topic fits Platform Signal platform-engineering mission."
            if state.dry_run
            else "Desk fallback stub: LLM unavailable."
        ),
        content_type=ContentType.explainer,
        author_persona=state.assigned_persona,
        central_thesis=f"Platform Signal should explain {state.topic} with evidence and clear boundaries.",
        research_review="strongly_recommended",
    )


def create_brief(state: WorkflowState) -> WorkflowState:
    if state.brief_path:
        try:
            state.brief = load_brief(Path(state.brief_path))
            state.stage = WorkflowStage.brief
            state.touch()
            return state
        except Exception as exc:  # noqa: BLE001
            state.errors.append(f"failed to load brief {state.brief_path}: {exc}")

    if state.desk_decision is None:
        state.errors.append("desk_decision missing before brief")
        return state

    decision = state.desk_decision
    if decision.status in {EditorialDecisionStatus.REJECT, EditorialDecisionStatus.WATCH}:
        state.errors.append(f"Desk returned {decision.status}; brief not created.")
        return state

    if _use_llm(state):
        from editorial_runtime.agents.desk import run_desk_brief

        try:
            state.brief = run_desk_brief(state)
        except Exception as exc:  # noqa: BLE001
            state.errors.append(f"brief LLM failed: {exc}")
            state.brief = _brief_stub(state, decision)
    else:
        state.brief = _brief_stub(state, decision)

    state.stage = WorkflowStage.brief
    state.touch()
    return state


def _brief_stub(state: WorkflowState, decision: EditorialDecision) -> ArticleBrief:
    article_id = f"PS-{int(uuid.uuid4().int % 1_000_000):06d}"
    return ArticleBrief(
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


def author_outline(state: WorkflowState) -> WorkflowState:
    if state.brief is None:
        state.errors.append("brief missing before outline")
        return state

    if state.outline:
        state.stage = WorkflowStage.author_outline
        state.touch()
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

    body = state.outline or ""
    if _use_llm(state):
        from editorial_runtime.agents.author import run_author_draft

        try:
            output = run_author_draft(state, brief=state.brief)
            state.outline = output.outline
            body = output.draft_mdx
        except Exception as exc:  # noqa: BLE001
            state.errors.append(f"author LLM failed: {exc}")

    draft_mdx = (
        f"---\n"
        f"title: {state.brief.working_title}\n"
        f"---\n\n"
        f"{body}\n"
    )
    draft_path.write_text(draft_mdx, encoding="utf-8")
    state.draft_mdx = draft_mdx
    state.draft_path = str(draft_path)
    state.stage = WorkflowStage.author_draft
    state.touch()
    return state


def evidence_review(state: WorkflowState) -> WorkflowState:
    draft_mdx = state.draft_mdx or ""
    if not draft_mdx and state.draft_path:
        draft_mdx = Path(state.draft_path).read_text(encoding="utf-8")

    if _use_llm(state) and state.brief is not None:
        from editorial_runtime.agents.evidence import run_evidence_review

        try:
            state.evidence_review = run_evidence_review(
                state,
                brief=state.brief,
                draft_mdx=draft_mdx,
            )
        except Exception as exc:  # noqa: BLE001
            state.errors.append(f"evidence LLM failed: {exc}")
            state.evidence_review = _evidence_stub(state)
    else:
        state.evidence_review = _evidence_stub(state)

    state.stage = WorkflowStage.evidence
    state.touch()
    return state


def _evidence_stub(state: WorkflowState) -> EvidenceReview:
    return EvidenceReview(
        editor_status=EvidenceOutcome.pass_ if state.dry_run else EvidenceOutcome.hold,
        confidence=75 if state.dry_run else 0,
        summary=(
            "Dry-run PASS: evidence review deferred until Evidence Editor LLM is wired."
            if state.dry_run
            else "Evidence review requires LLM credentials or --test-model."
        ),
    )


def route_after_evidence(state: WorkflowState) -> str:
    if state.evidence_review is None:
        return "human_gate"
    if (
        state.evidence_review.editor_status == EvidenceOutcome.pass_with_changes
        and state.revision_count < state.max_revisions
    ):
        return "revision"
    return "human_gate"


def revision(state: WorkflowState) -> WorkflowState:
    state.revision_count += 1
    state.stage = WorkflowStage.revision
    state.touch()
    return state


def human_gate(state: WorkflowState) -> WorkflowState:
    state.stage = WorkflowStage.human_gate
    state.human_status = "pending"
    state.touch()
    return state
