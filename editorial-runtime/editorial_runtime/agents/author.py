"""Author Engine — outline and draft generation."""

from __future__ import annotations

import re
from pathlib import Path

from pydantic_ai import Agent
from pydantic_ai.settings import ModelSettings

from editorial_runtime.context import assemble_author_context
from editorial_runtime.llm.router import agent_metadata, resolve_model
from editorial_runtime.models import ArticleBrief, ModelUsageRecord, WorkflowState
from editorial_runtime.repo import find_repo_root
from editorial_runtime.sources import load_source_pack


AUTHOR_INSTRUCTIONS = """
You are Platform Signal's Author Engine — one shared writing runtime.

Write the article as MDX prose. Do not return JSON. Do not return an outline object.

House style:
- At a Glance is a two-column markdown table (Attribute | Value).
- Callout types: signal, production, watch, field. Never type="warning".
- Include Why This Matters, the brief's required sections, and a Recommendation with Use when / Wait when.
- Write in the loaded persona. Do not sound like a generic consultant.

Hard rules:
- Do not invent citations, percentages, employers, customers, or case studies.
- Do not invent production war stories or "a bank / a vendor / we saw 30%" anecdotes.
- Cite approved sources only for what their notes actually state. Do not put claims in a source's mouth.
- If a claim needs a source you do not have, omit it.
- MCP means Model Context Protocol: hosts, clients, and servers over JSON-RPC. It is not an agent architecture, not a harness, and not Multi-Cluster Pod.
- Separate protocol (MCP) from harness (operable layer) from framework (developer SDK).
- Do not emit <Figure>, markdown images, or invented src/id paths unless required_visuals lists a real PS-D-NNNN diagram. If visuals are deferred, omitted, or empty, write in prose only.
- Hit the brief target_length in words (about ±15%). A stub that skips required sections fails the brief.
- Do not publish.
"""

FENCE = re.compile(r"^```(?:mdx|markdown|md)?\n([\s\S]*?)\n```$", re.IGNORECASE)


def unwrap_mdx(text: str) -> str:
    stripped = text.strip()
    match = FENCE.match(stripped)
    if match:
        return match.group(1).strip()
    return stripped


def story_constraints_block(brief: ArticleBrief) -> str:
    visuals = ", ".join(brief.required_visuals) or "none"
    return "\n".join(
        [
            "# STORY CONSTRAINTS",
            f"Name this reader problem in the piece: {brief.reader_problem}",
            f"Answer this question: {brief.primary_question}",
            f"Hold this thesis; do not water it down: {brief.central_thesis}",
            f"Unique angle: {brief.unique_angle}",
            f"Required sections: {', '.join(brief.required_sections)}",
            f"Required visuals: {visuals}",
            "Cite approved sources only for what their notes state.",
            "Do not invent a third definition of the topic beyond the reader problem and the thesis.",
        ],
    )


def _author_agent(*, use_test_model: bool, root: Path | None) -> Agent[None, str]:
    model = resolve_model("writer", use_test_model=use_test_model, root=root)
    return Agent(
        model,
        output_type=str,
        instructions=AUTHOR_INSTRUCTIONS,
        name="author",
        model_settings=ModelSettings(max_tokens=8192),
    )


def author_revision_block(state: WorkflowState) -> str:
    """Notes and prior draft for a rewrite. Empty on the first Author pass."""
    if state.revision_count < 1:
        return ""
    parts = [
        "# REVISION",
        "Rewrite the draft as MDX prose, not JSON. Do not invent case studies, percentages, or Figure/src paths to fill gaps.",
        f"Target length: about {state.brief.target_length if state.brief else 1600} words.",
    ]
    if state.evidence_review:
        parts.append("Evidence Editor requested changes:")
        parts.append(state.evidence_review.summary)
    if state.revision_notes:
        parts.append("Human Editor-in-Chief notes:")
        parts.append(state.revision_notes)
    if state.draft_mdx:
        parts.append("Previous draft:")
        parts.append(state.draft_mdx[:12000])
    return "\n\n".join(parts)


def run_author_draft(
    state: WorkflowState,
    *,
    brief: ArticleBrief,
    root: Path | None = None,
) -> str:
    repo = root or find_repo_root()
    context = assemble_author_context(
        persona=brief.author_persona,
        brief=brief,
        persona_version=state.persona_version,
        root=repo,
    )
    source_pack = load_source_pack(state.source_ids, root=repo)
    revision_note = author_revision_block(state)
    agent = _author_agent(use_test_model=state.use_test_model, root=repo)
    prompt = (
        f"{context}\n\n"
        f"{story_constraints_block(brief)}\n\n"
        f"# APPROVED SOURCES\n{source_pack}\n"
        f"{revision_note}\n"
        f"Target length: about {brief.target_length} words.\n"
        "Write the MDX article body only. No YAML frontmatter. No JSON.\n"
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
    return unwrap_mdx(result.output)
