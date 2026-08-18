"""Deterministic Evidence gates that the LLM cannot override."""

from __future__ import annotations

import re
from pathlib import Path

from editorial_runtime.models import ArticleBrief, ClaimReview, EvidenceOutcome, EvidenceReview

FIGURE_SRC = re.compile(
    r"""(?:<Figure\b[^>]*\b(?:src|id)\s*=\s*["']([^"']+)["'])|(?:!\[[^\]]*]\(([^)]+)\))""",
    re.IGNORECASE,
)
PERCENTAGE = re.compile(r"\b\d+(?:\.\d+)?%\b")
FAKE_CASE = re.compile(
    r"\b(case study|a bank|financial institution|digital marketing platform|"
    r"large-scale digital marketing|we saw|our customer|at Google|at Amazon)\b",
    re.IGNORECASE,
)
WRONG_MCP = re.compile(r"multi[-\s]?cluster pod", re.IGNORECASE)


def _mentions_mcp_roles(draft: str) -> bool:
    lower = draft.lower()
    return all(word in lower for word in ("host", "client", "server"))


def _missing_assets(draft: str, *, article_slug: str | None, root: Path | None) -> list[str]:
    missing: list[str] = []
    if root is None:
        return missing
    for match in FIGURE_SRC.finditer(draft):
        ref = match.group(1) or match.group(2)
        if not ref:
            continue
        if ref.startswith("http://") or ref.startswith("https://"):
            continue
        if ref.startswith("PS-D-") and article_slug:
            path = root / "content" / "articles" / article_slug / "diagrams" / f"{ref}.svg"
        else:
            path = root / "public" / ref.lstrip("/")
            if not path.is_file():
                path = root / ref.lstrip("/")
        if not path.is_file():
            missing.append(ref)
    return missing


def apply_evidence_gates(
    review: EvidenceReview,
    *,
    brief: ArticleBrief,
    draft_mdx: str,
    root: Path | None = None,
) -> EvidenceReview:
    """Downgrade LLM PASS when deterministic defects are present."""
    defects: list[str] = []
    extra_claims = list(review.claim_reviews)

    if WRONG_MCP.search(draft_mdx):
        defects.append("MCP expanded as Multi-Cluster Pod (INCORRECT).")
        extra_claims.append(
            ClaimReview(
                claim_id="C900",
                status="INCORRECT",
                note="Draft expands MCP as Multi-Cluster Pod.",
            ),
        )

    if "mcp" in brief.working_title.lower() or "mcp" in brief.central_thesis.lower():
        if not _mentions_mcp_roles(draft_mdx):
            defects.append("MCP draft omits host/client/server roles.")
            extra_claims.append(
                ClaimReview(
                    claim_id="C901",
                    status="UNSUPPORTED",
                    note="MCP roles host, client, and server are not all present.",
                ),
            )

    slug = None
    if brief.opportunity_id == "PS-O-0008":
        slug = "mcp-for-platform-engineers"
    missing = _missing_assets(draft_mdx, article_slug=slug, root=root)
    if missing:
        defects.append(f"Referenced assets do not exist: {', '.join(missing)}")
        extra_claims.append(
            ClaimReview(
                claim_id="C902",
                status="UNSUPPORTED",
                note=f"Missing figure/asset paths: {', '.join(missing)}",
            ),
        )

    if FAKE_CASE.search(draft_mdx) or PERCENTAGE.search(draft_mdx):
        defects.append("Draft contains invented case-study, employer, or percentage claims.")
        extra_claims.append(
            ClaimReview(
                claim_id="C903",
                status="UNSUPPORTED",
                note="Anecdote, employer, or percentage without a tier-1 source in the pack.",
            ),
        )

    if not defects:
        return review

    status = EvidenceOutcome.hold
    if review.editor_status == EvidenceOutcome.fail:
        status = EvidenceOutcome.fail
    summary = review.summary.rstrip()
    gate_note = " Deterministic gates: " + " ".join(defects)
    return review.model_copy(
        update={
            "editor_status": status,
            "confidence": min(review.confidence, 60),
            "claim_reviews": extra_claims,
            "summary": summary + gate_note,
        },
    )
