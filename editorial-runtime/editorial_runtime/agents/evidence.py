"""Technical Research Editor — evidence review."""

from __future__ import annotations

from pathlib import Path

from pydantic_ai import Agent

from editorial_runtime.llm.router import agent_metadata, resolve_model
from editorial_runtime.evidence_gates import apply_evidence_gates
from editorial_runtime.models import ArticleBrief, EvidenceReview, ModelUsageRecord, WorkflowState
from editorial_runtime.repo import find_repo_root
from editorial_runtime.sources import load_source_pack


EVIDENCE_INSTRUCTIONS = """
You are Platform Signal's Technical Research Editor.

Rules:
- Never fabricate citations or sources.
- Separate FACT, ANALYSIS, OPINION, and PREDICTION.
- Use statuses: VERIFIED, SUPPORTED, CONTESTED, UNSUPPORTED, INCORRECT.
- Return pass, pass_with_changes, hold, or fail.
- If claims lack tier-1 sources, prefer pass_with_changes or hold — not pass.
- Invented case studies, percentages, employers, or war stories → HOLD or FAIL.
- MCP means Model Context Protocol (hosts, clients, servers, JSON-RPC). 
  Expanding it as Multi-Cluster Pod or treating it as an agent architecture is INCORRECT.
- Invented Figure/src paths, missing files, or diagrams that are not in the article package → HOLD.
- MCP articles must name host, client, and server. Missing roles → pass_with_changes or HOLD, never pass.
- Do not PASS a draft that is merely plausible. PASS requires the approved source pack to support the claims and no deterministic defects.
"""


def _evidence_agent(*, use_test_model: bool, root: Path | None) -> Agent[None, EvidenceReview]:
    model = resolve_model("research", use_test_model=use_test_model, root=root)
    return Agent(
        model,
        output_type=EvidenceReview,
        instructions=EVIDENCE_INSTRUCTIONS,
        name="evidence",
    )


def run_evidence_review(
    state: WorkflowState,
    *,
    brief: ArticleBrief,
    draft_mdx: str,
    root: Path | None = None,
) -> EvidenceReview:
    repo = root or find_repo_root()
    agent = _evidence_agent(use_test_model=state.use_test_model, root=repo)
    claims = "\n".join(f"- {claim}" for claim in brief.claims_to_verify) or "- (none listed)"
    source_pack = load_source_pack(state.source_ids, root=repo)
    prompt = (
        f"Article: {brief.working_title}\n"
        f"Thesis: {brief.central_thesis}\n\n"
        f"Claims to verify:\n{claims}\n\n"
        f"Approved sources:\n{source_pack}\n\n"
        f"Draft MDX:\n{draft_mdx[:12000]}\n"
    )
    metadata = agent_metadata(
        workflow_id=state.workflow_id,
        agent="evidence",
        persona=brief.author_persona.value,
        workflow_stage="evidence",
        content_type=brief.content_type.value,
        model_alias="research",
        model=str(agent.model),
    )
    result = agent.run_sync(prompt, metadata=metadata)
    state.model_usage.append(
        ModelUsageRecord(
            agent="evidence",
            capability="research",
            model=str(agent.model),
            workflow_stage="evidence",
        ),
    )
    return apply_evidence_gates(
        result.output,
        brief=brief,
        draft_mdx=draft_mdx,
        root=repo,
    )
