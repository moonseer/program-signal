"""Load approved sources from editorial/sources.yml."""

from __future__ import annotations

from pathlib import Path

import yaml

from editorial_runtime.repo import find_repo_root


def load_source_pack(
    source_ids: list[str] | None = None,
    *,
    root: Path | None = None,
) -> str:
    """Return a compact evidence pack. Empty ids still include SRC-MCP-001 for MCP topics."""
    repo = root or find_repo_root()
    path = repo / "editorial" / "sources.yml"
    if not path.is_file():
        return "(no editorial/sources.yml)"

    records = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    sources = records.get("sources", [])
    wanted = list(source_ids or [])
    if not wanted:
        wanted = ["SRC-MCP-001"]

    by_id = {item.get("source_id"): item for item in sources if item.get("source_id")}
    lines: list[str] = ["Approved sources (tier-1 preferred). Do not invent others."]
    for source_id in wanted:
        item = by_id.get(source_id)
        if not item:
            lines.append(f"- {source_id}: MISSING from editorial/sources.yml")
            continue
        lines.append(
            f"- {source_id}: {item.get('title')} "
            f"({item.get('organization', 'unknown')}, tier {item.get('tier')}) "
            f"{item.get('url', '')}".strip()
        )
        if item.get("notes"):
            lines.append(f"  notes: {item['notes']}")
    return "\n".join(lines)
