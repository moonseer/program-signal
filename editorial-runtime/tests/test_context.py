from pathlib import Path

from editorial_runtime.context import assemble_author_context
from editorial_runtime.models import PersonaName
from editorial_runtime.persona import load_persona
from editorial_runtime.repo import find_repo_root


def test_find_repo_root():
    root = find_repo_root(Path(__file__).resolve().parents[2])
    assert (root / "editorial" / "registry.yml").is_file()


def test_load_maya_persona():
    root = find_repo_root(Path(__file__).resolve().parents[2])
    package = load_persona(PersonaName.maya, root=root)
    assert "Architect" in package.files["persona.md"]


def test_assemble_context_includes_layers():
    root = find_repo_root(Path(__file__).resolve().parents[2])
    brief = root / "editorial" / "briefs" / "PS-000008.yml"
    text = assemble_author_context(
        persona=PersonaName.maya,
        brief_path=brief,
        root=root,
    )
    assert "PERSONA PACKAGE" in text
    assert "ARTICLE BRIEF" in text
    assert "MCP for Platform Engineers" in text
