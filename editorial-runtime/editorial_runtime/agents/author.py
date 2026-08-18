"""Author Engine — outline and draft generation."""

from __future__ import annotations

from pathlib import Path

from pydantic_ai import Agent

from editorial_runtime.context import assemble_author_context
from editorial_runtime.llm.router import agent_metadata, resolve_model
from editorial_runtime.models import ArticleBrief, AuthorDraftOutput, ModelUsageRecord, WorkflowState
from editorial_runtime.repo import find_repo_root


def _author_agent(*, use_test_model: bool, root: Path | None) -> Agent[None, AuthorDraftOutput]:
    model = resolve_model("writer", use_test_model=use_test_model, root=root)
    return Agent(
        model,
        output_type=AuthorDraftOutput,
        instructions=(
            "You are Platform Signal's Author Engine. "
            "Write MDX using Callout, Figure, and Recommendation where appropriate. "
            "Do not invent citations or fake experience. Return outline and draft_mdx."
        ),
        name="author",
    )


def run_author_draft(
    state: WorkflowState,
    *,
    brief: ArticleBrief,
    root: Path | None = None,
) -> AuthorDraftOutput:
    repo = root or find_repo_root()
    context = assemble_author_context(
        persona=brief.author_persona,
        brief=brief,
        persona_version=state.persona_version,
        root=repo,
    )
    agent = _author_agent(use_test_model=state.use_test_model, root=repo)
    prompt = (
        f"{context}\n\n"
        "Produce:\n"
        "1. outline — markdown section list\n"
        "2. draft_mdx — article body only (no YAML frontmatter)\n"
    )
    metadata = agent_metadata(
        workflow_id=state.workflow_id,
        agent="author",
        persona=brief.author_persona.value,
        workflow_stage="author_draft",
        content_type=brief.content_type.value,
        model_alias="writer",
        model=str(agent.model),
    )
    result = agent.run_sync(prompt, metadata=metadata)
    state.model_usage.append(
        ModelUsageRecord(
            agent="author",
            capability="writer",
            model=str(agent.model),
            workflow_stage="author_draft",
        ),
    )
    return result.output
