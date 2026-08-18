"""Read collision-safe ID cursors from editorial/registry.yml."""

from __future__ import annotations

from pathlib import Path

import yaml

from editorial_runtime.repo import find_repo_root


def peek_next_article_id(root: Path | None = None) -> str:
    repo = root or find_repo_root()
    registry = yaml.safe_load(
        (repo / "editorial" / "registry.yml").read_text(encoding="utf-8"),
    )
    seq = int(registry["next"]["article"])
    return f"PS-{seq:06d}"
