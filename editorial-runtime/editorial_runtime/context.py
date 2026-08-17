"""Assemble Author Engine context from layered inputs."""

from __future__ import annotations

from pathlib import Path

import yaml

from editorial_runtime.models import ArticleBrief, PersonaName
from editorial_runtime.persona import load_persona
from editorial_runtime.repo import find_repo_root


def load_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def load_brief(path: Path) -> ArticleBrief:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    return ArticleBrief.model_validate(data)


def assemble_author_context(
    *,
    persona: PersonaName,
    brief_path: Path | None = None,
    brief: ArticleBrief | None = None,
    evidence_path: Path | None = None,
    persona_version: str = "1.0.0",
    root: Path | None = None,
) -> str:
    """Build the Author Engine prompt context (persona ≠ editorial policy ≠ brief ≠ evidence)."""
    repo = root or find_repo_root()
    base_author = load_text(repo / "agents" / "author" / "base-author.md")
    standards = load_text(repo / "docs" / "editorial" / "EDITORIAL-STANDARDS.md")
    package = load_persona(persona, version=persona_version, root=repo)

    if brief is None:
        if brief_path is None:
            raise ValueError("brief or brief_path is required")
        brief = load_brief(brief_path)

    sections = [
        "# BASE AUTHOR INSTRUCTIONS\n",
        base_author.strip(),
        "\n\n# PLATFORM SIGNAL EDITORIAL STANDARDS\n",
        standards.strip(),
        "\n\n# PERSONA PACKAGE\n",
        package.render(),
        "\n\n# CONTENT TYPE\n",
        brief.content_type.value,
        "\n\n# ARTICLE BRIEF\n",
        yaml.safe_dump(brief.model_dump(mode="json"), sort_keys=False).strip(),
    ]

    if evidence_path and evidence_path.is_file():
        sections.extend(
            [
                "\n\n# APPROVED RESEARCH / EVIDENCE\n",
                evidence_path.read_text(encoding="utf-8").strip(),
            ],
        )

    sections.append("\n\n# ARTICLE CONTEXT\n")
    sections.append(
        "Draft an MDX article that satisfies the brief. Do not invent citations or experience. "
        "Use Platform Signal components (Callout, Figure, Recommendation) where appropriate.",
    )

    return "\n".join(sections)
