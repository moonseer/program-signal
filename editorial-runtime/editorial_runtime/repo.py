"""Locate the Platform Signal repository root."""

from __future__ import annotations

from pathlib import Path


def find_repo_root(start: Path | None = None) -> Path:
    current = (start or Path.cwd()).resolve()
    for candidate in [current, *current.parents]:
        if (candidate / "editorial" / "registry.yml").is_file() and (
            candidate / "agents" / "author" / "base-author.md"
        ).is_file():
            return candidate
    raise FileNotFoundError(
        "Could not find Platform Signal repo root (need editorial/registry.yml and agents/author/)",
    )
