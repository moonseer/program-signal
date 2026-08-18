# Editorial runtime (Phase 1)

Python workflow for Platform Signal's editorial harness: **Desk → Author Engine → Evidence → human gate**.

Canonical spec: [`docs/PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md`](../docs/PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md).

## What Phase 1 proves

- One **Author Engine** loads persona packages from [`agents/author/`](../agents/author/) — not four separate agent runtimes.
- **LangGraph** orchestrates explicit stages with conditional Evidence routing.
- **PydanticAI** agents for Desk, Author, and Evidence return typed outputs (`EditorialDecision`, `ArticleBrief`, `AuthorDraftOutput`, `EvidenceReview`).
- **Capability routing** via `config/models.yaml` and `PS_MODEL_*` env overrides (`research`, `reasoning`, `writer`, `fast`, `local`).
- **Human approval** is a hard stop before publish.
- **Dry-run** (default), **`--test-model`** (pydantic-ai test model, no keys), or **`--live`** (real providers).

PostgreSQL persistence and Radar automation land in later slices.

## Setup

```bash
cd editorial-runtime
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev,llm]"
cp .env.example .env   # add OPENAI_API_KEY or similar for --live
```

## Usage

From the repository root:

```bash
# Stub nodes (no LLM)
ps-editorial run --topic "MCP for platform engineers" --persona maya --dry-run

# Exercise LLM wiring without API keys
ps-editorial run --topic "MCP for platform engineers" --persona maya --test-model

# Real providers (requires credentials)
ps-editorial run --topic "MCP for platform engineers" --persona maya --live

ps-editorial assemble-context --persona maya --brief editorial/briefs/PS-000008.yml
pytest
```

## Layout

```text
editorial-runtime/
  editorial_runtime/   # workflow, models, CLI
  tests/
agents/author/         # persona packages (repo root)
```

## Model routing (planned)

Capability aliases — not per-persona models: `research`, `reasoning`, `writer`, `fast`, `local`. See `config/models.example.yaml`.
