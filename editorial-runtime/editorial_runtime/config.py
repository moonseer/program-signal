"""Runtime configuration — model routing and capabilities."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

import yaml

from editorial_runtime.repo import find_repo_root

CAPABILITIES = ("research", "reasoning", "writer", "fast", "local")


@dataclass(frozen=True)
class CapabilityRoute:
    primary: str
    fallback: str | None = None


def models_config_path(root: Path | None = None) -> Path:
    repo = root or find_repo_root()
    path = repo / "editorial-runtime" / "config" / "models.yaml"
    if not path.is_file():
        path = repo / "editorial-runtime" / "config" / "models.example.yaml"
    return path


def load_capability_routes(root: Path | None = None) -> dict[str, CapabilityRoute]:
    path = models_config_path(root)
    raw = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    routes: dict[str, CapabilityRoute] = {}
    for capability in CAPABILITIES:
        block = raw.get(capability, {})
        if isinstance(block, str):
            routes[capability] = CapabilityRoute(primary=block)
            continue
        primary = block.get("primary")
        if not primary:
            continue
        routes[capability] = CapabilityRoute(
            primary=str(primary),
            fallback=block.get("fallback"),
        )
    return routes


def resolve_capability_model(capability: str, *, root: Path | None = None) -> str:
    env_key = f"PS_MODEL_{capability.upper()}"
    if override := os.getenv(env_key):
        return override.strip()

    routes = load_capability_routes(root)
    route = routes.get(capability)
    if route is None:
        raise KeyError(f"Unknown capability: {capability}")

    if llm_credentials_available():
        return route.primary
    if route.fallback:
        return route.fallback
    return route.primary


def llm_credentials_available() -> bool:
    """True when at least one supported provider credential is set."""
    keys = (
        "OPENAI_API_KEY",
        "ANTHROPIC_API_KEY",
        "GEMINI_API_KEY",
        "GOOGLE_API_KEY",
        "AZURE_OPENAI_API_KEY",
        "OPENROUTER_API_KEY",
    )
    return any(os.getenv(name) for name in keys)
