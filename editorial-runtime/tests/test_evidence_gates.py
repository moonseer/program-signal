from pathlib import Path

from editorial_runtime.evidence_gates import apply_evidence_gates
from editorial_runtime.models import ArticleBrief, ContentType, EvidenceOutcome, EvidenceReview, PersonaName
from editorial_runtime.repo import find_repo_root


def _brief() -> ArticleBrief:
    return ArticleBrief(
        article_id="PS-000008",
        opportunity_id="PS-O-0008",
        working_title="MCP for Platform Engineers",
        content_type=ContentType.explainer,
        author_persona=PersonaName.maya,
        target_reader=["platform engineers"],
        primary_question="What is MCP?",
        reader_problem="Protocol treated as a platform.",
        central_thesis="MCP is a tool-access protocol.",
        why_now="Adoption without operations.",
        unique_angle="Host, identity, blast radius.",
        required_sections=["why this matters"],
        claims_to_verify=["MCP is a protocol"],
        target_length=1800,
        research_review="strongly_recommended",
    )


def test_missing_figure_downgrades_pass_to_hold():
    review = EvidenceReview(
        editor_status=EvidenceOutcome.pass_,
        confidence=95,
        summary="Looks fine.",
        claim_reviews=[],
    )
    draft = '<Figure src="/images/mcp-protocol-vs-product-diagram.svg" alt="x" />\nHost client server'
    gated = apply_evidence_gates(
        review,
        brief=_brief(),
        draft_mdx=draft,
        root=find_repo_root(Path(__file__).resolve().parents[2]),
    )
    assert gated.editor_status == EvidenceOutcome.hold
    assert gated.confidence <= 60
    assert "Missing figure" in gated.summary or "do not exist" in gated.summary


def test_missing_mcp_roles_downgrades_pass():
    review = EvidenceReview(
        editor_status=EvidenceOutcome.pass_,
        confidence=90,
        summary="Verified.",
        claim_reviews=[],
    )
    gated = apply_evidence_gates(
        review,
        brief=_brief(),
        draft_mdx="MCP is a protocol for tools.",
        root=find_repo_root(Path(__file__).resolve().parents[2]),
    )
    assert gated.editor_status == EvidenceOutcome.hold
    assert "host/client/server" in gated.summary


def test_clean_mcp_draft_keeps_pass():
    review = EvidenceReview(
        editor_status=EvidenceOutcome.pass_,
        confidence=80,
        summary="Supported by SRC-MCP-001.",
        claim_reviews=[],
    )
    draft = (
        "MCP defines hosts, clients, and servers over JSON-RPC. "
        "It is a tool-access protocol, not an agent architecture."
    )
    gated = apply_evidence_gates(
        review,
        brief=_brief(),
        draft_mdx=draft,
        root=find_repo_root(Path(__file__).resolve().parents[2]),
    )
    assert gated.editor_status == EvidenceOutcome.pass_
    assert gated.confidence == 80
