"""Load versioned persona packages for the Author Engine."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from editorial_runtime.models import PersonaName
from editorial_runtime.repo import find_repo_root

PERSONA_FILES = (
    "persona.md",
    "voice.md",
    "patterns.md",
    "examples.md",
    "anti-patterns.md",
    "review-rubric.md",
)


@dataclass(frozen=True)
class PersonaPackage:
    name: PersonaName
    version: str
    files: dict[str, str]

    def render(self) -> str:
        parts = [f"# Persona: {self.name.value} ({self.version})\n"]
        for filename in PERSONA_FILES:
            if filename in self.files:
                parts.append(f"\n## {filename}\n\n{self.files[filename].strip()}\n")
        return "\n".join(parts)


def persona_dir(root: Path, persona: PersonaName) -> Path:
    return root / "agents" / "author" / "personas" / persona.value


def load_persona(persona: PersonaName, version: str = "1.0.0", root: Path | None = None) -> PersonaPackage:
    repo = root or find_repo_root()
    directory = persona_dir(repo, persona)
    if not directory.is_dir():
        raise FileNotFoundError(f"Missing persona package: {directory}")

    files: dict[str, str] = {}
    for filename in PERSONA_FILES:
        path = directory / filename
        if path.is_file():
            files[filename] = path.read_text(encoding="utf-8")

    if "persona.md" not in files:
        raise FileNotFoundError(f"persona.md is required in {directory}")

    return PersonaPackage(name=persona, version=version, files=files)
