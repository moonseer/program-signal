"""Author Engine — outline and draft generation."""

from __future__ import annotations

from pathlib import Path

from pydantic_ai import Agent

from editorial_runtime.context import assemble_author_context
from editorial_runtime.llm.router import agent_metadata, resolve_model
from editorial_runtime.models import ArticleBrief, AuthorDraftOutput, ModelUsageRecord, WorkflowState
from editorial_runtime.repo import find_repo_root
from editorial_runtime.sources import load_source_pack


AUTHOR_INSTRUCTIONS = """
You are Platform Signal's Author Engine — one shared writing runtime.

Write MDX using Callout, Figure, and Recommendation where they help.
Include At a Glance, Why This Matters, and a Recommendation with Use when / Wait when.

Hard rules:
- Do not invent citations, percentages, employers, customers, or case studies.
- Do not invent production war stories or "a bank / a vendor / we saw 30%" anecdotes.
- If a claim needs a source you do not have, omit the anecdote and stay at the protocol/architecture level.
- MCP means Model Context Protocol: hosts, clients, and servers over JSON-RPC. It is not an agent architecture, not a harness, and not Multi-Cluster Pod.
- Separate protocol (MCP) from harness (operable layer) from framework (developer SDK).
- Do not publish.
"""


def _author_agent(*, use_test_model: bool, root: Path | None) -> Agent[None, AuthorDraftOutput]:
    model = resolve_model("writer", use_test_model=use_test_model, root=root)
    return Agent(
        model,
        output_type=AuthorDraftOutput,
        instructions=AUTHOR_INSTRUCTIONS,
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
    source_pack = load_source_pack(state.source_ids, root=repo)
    revision_note = ""
    if state.evidence_review and state.revision_count:
        revision_note = (
            "\n\nEvidence Editor requested changes:\n"
            f"{state.evidence_review.summary}\n"
            "Revise. Do not invent new case studies to satisfy evidence gaps.\n"
        )
    agent = _author_agent(use_test_model=state.use_test_model, root=repo)
    prompt = (
        f"{context}\n\n"
        f"# APPROVED SOURCES\n{source_pack}\n"
        f"{revision_note}\n"
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
