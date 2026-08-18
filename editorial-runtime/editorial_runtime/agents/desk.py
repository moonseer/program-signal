"""Managing Editor (Desk) — structured editorial decisions and briefs."""

from __future__ import annotations

from pathlib import Path

from pydantic_ai import Agent

from editorial_runtime.llm.router import agent_metadata, resolve_model
from editorial_runtime.models import ArticleBrief, EditorialDecision, ModelUsageRecord, WorkflowState
from editorial_runtime.registry import peek_next_article_id
from editorial_runtime.repo import find_repo_root


DESK_INSTRUCTIONS = """
You are Platform Signal's Managing Editor (The Desk).

Mission: decide what Platform Signal should publish and how — not whether claims are true.

Rules:
- Protect mission fit for platform engineers, SRE, and architects.
- Never invent search volume, trend data, or citations.
- Never mark technical claims verified.
- Never publish autonomously.
- Preserve persona differences; assign the best primary persona for the topic.
- Reject commodity explainers and duplicate angles.

Return structured output only.
"""


def _desk_agent(*, use_test_model: bool, root: Path | None) -> Agent[None, EditorialDecision]:
    model = resolve_model("reasoning", use_test_model=use_test_model, root=root)
    return Agent(
        model,
        output_type=EditorialDecision,
        instructions=DESK_INSTRUCTIONS,
        name="desk",
    )


def _brief_agent(*, use_test_model: bool, root: Path | None) -> Agent[None, ArticleBrief]:
    model = resolve_model("reasoning", use_test_model=use_test_model, root=root)
    return Agent(
        model,
        output_type=ArticleBrief,
        instructions=DESK_INSTRUCTIONS
        + "\nProduce a complete ArticleBrief after an APPROVE or APPROVE WITH REFRAMING decision.",
        name="desk-brief",
    )


def run_desk_decision(state: WorkflowState, *, root: Path | None = None) -> EditorialDecision:
    repo = root or find_repo_root()
    agent = _desk_agent(use_test_model=state.use_test_model, root=repo)
    prompt = (
        f"Topic proposal: {state.topic}\n"
        f"Suggested persona: {state.assigned_persona.value}\n"
        "Evaluate editorial fit for Platform Signal. Assign content type and persona."
    )
    metadata = agent_metadata(
        workflow_id=state.workflow_id,
        agent="desk",
        persona=state.assigned_persona.value,
        workflow_stage="desk",
        content_type=None,
        model_alias="reasoning",
        model=str(agent.model),
    )
    result = agent.run_sync(prompt, metadata=metadata)
    state.model_usage.append(
        ModelUsageRecord(
            agent="desk",
            capability="reasoning",
            model=str(agent.model),
            workflow_stage="desk",
        ),
    )
    return result.output


def run_desk_brief(state: WorkflowState, *, root: Path | None = None) -> ArticleBrief:
    if state.desk_decision is None:
        raise ValueError("desk_decision required")

    repo = root or find_repo_root()
    agent = _brief_agent(use_test_model=state.use_test_model, root=repo)
    article_id = peek_next_article_id(repo)
    prompt = (
        f"Topic: {state.topic}\n"
        f"Assigned article id: {article_id}\n"
        f"Desk decision:\n{state.desk_decision.model_dump_json(indent=2)}\n"
        "Write the ArticleBrief YAML fields as structured output."
    )
    metadata = agent_metadata(
        workflow_id=state.workflow_id,
        agent="desk",
        persona=state.desk_decision.author_persona.value,
        workflow_stage="brief",
        content_type=state.desk_decision.content_type.value,
        model_alias="reasoning",
        model=str(agent.model),
    )
    result = agent.run_sync(prompt, metadata=metadata)
    brief = result.output
    return brief.model_copy(update={"article_id": article_id, "editorial_decision": state.desk_decision.status})
