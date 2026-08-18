"""Resolve capability aliases to provider:model strings."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from editorial_runtime.config import llm_credentials_available, resolve_capability_model


def resolve_model(
    capability: str,
    *,
    use_test_model: bool = False,
    root: Path | None = None,
) -> str:
    if use_test_model:
        return "test"
    if not llm_credentials_available():
        raise RuntimeError(
            "No LLM credentials found. Set OPENAI_API_KEY (or another provider key), "
            "pass --test-model, or use default dry-run mode.",
        )
    return resolve_capability_model(capability, root=root)


def agent_metadata(
    *,
    workflow_id: str,
    agent: str,
    persona: str | None,
    workflow_stage: str,
    content_type: str | None,
    model_alias: str,
    model: str,
) -> dict[str, Any]:
    tags = {
        "platform-signal": True,
        "workflow_id": workflow_id,
        "agent": agent,
        "workflow_stage": workflow_stage,
        "model_alias": model_alias,
        "model": model,
    }
    if persona:
        tags["persona"] = persona
    if content_type:
        tags["content_type"] = content_type
    return tags
