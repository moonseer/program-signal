# Editorial runtime (Phase 1)

Python workflow for Platform Signal's editorial harness: **Desk → Author Engine → Evidence → human gate**.

Canonical spec: [`docs/PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md`](../docs/PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md).

## What Phase 1 proves

- One **Author Engine** loads persona packages from [`agents/author/`](../agents/author/) — not four separate agent runtimes.
- **LangGraph** orchestrates explicit stages with conditional Evidence routing.
- **PydanticAI** agents: Desk and Evidence return typed outputs; Author returns MDX prose (not a JSON article object).
- **Capability routing** via `config/models.yaml` and `PS_MODEL_*` env overrides (`research`, `reasoning`, `writer`, `fast`, `local`).
- **Human approval** is a hard stop before publish. Review locally with `ps-editorial desk` (127.0.0.1 only). Accept/reject does not publish.
- **Dry-run** (default), **`--test-model`** (pydantic-ai test model, no keys), or **`--live`** (real providers).
- **PostgreSQL** persists workflow runs (stage, brief, evidence, draft). Draft MDX is still written under `runs/` for human review.

Radar automation lands in a later slice. This runtime is **not** hosted on Vercel Hobby.

## Setup

```bash
cd editorial-runtime
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev,llm]"
cp .env.example .env   # add OPENAI_API_KEY or similar for --live
docker compose up -d   # local Postgres
# in .env:
# DATABASE_URL=postgresql://platform_signal:platform_signal@127.0.0.1:5432/editorial
```

Without `DATABASE_URL` / `PS_DATABASE_URL`, runs are stored as JSON under `editorial-runtime/runs/` (dev fallback only).

## Usage

From the repository root:

```bash
# Stub nodes (no LLM)
ps-editorial run --topic "MCP for platform engineers" --persona maya --dry-run

# Exercise LLM wiring without API keys
ps-editorial run --topic "MCP for platform engineers" --persona maya --test-model

# Real providers (requires credentials)
# Direct OpenAI/Anthropic/OpenRouter, or a LiteLLM proxy via OPENAI_API_BASE + OPENAI_API_KEY
ps-editorial run --topic "MCP for platform engineers" --persona maya --live \
  --brief editorial/briefs/PS-000008.yml --source SRC-MCP-001 --max-revisions 1

ps-editorial list --stage human_gate
ps-editorial show <workflow_id>
ps-editorial desk            # local review UI at http://127.0.0.1:8787
ps-editorial decide <id> --accept|--reject --note "..."
ps-editorial assemble-context --persona maya --brief editorial/briefs/PS-000008.yml
pytest
```

## Layout

```text
editorial-runtime/
  editorial_runtime/   # workflow, models, CLI, store
  sql/                 # Postgres schema
  docker-compose.yml   # local Postgres
  tests/
agents/author/         # persona packages (repo root)
```

## Model routing (planned)

Capability aliases — not per-persona models: `research`, `reasoning`, `writer`, `fast`, `local`. See `config/models.example.yaml`.
