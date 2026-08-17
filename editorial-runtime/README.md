# Editorial runtime (Phase 1)

Python workflow for Platform Signal's editorial harness: **Desk → Author Engine → Evidence → human gate**.

Canonical spec: [`docs/PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md`](../docs/PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md).

## What Phase 1 proves

- One **Author Engine** loads persona packages from [`agents/author/`](../agents/author/) — not four separate agent runtimes.
- **LangGraph** orchestrates explicit stages with conditional Evidence routing.
- **Pydantic** models mirror repo YAML schemas (`OpportunityCard`, `ArticleBrief`, `EvidenceReview`, …).
- **Human approval** is a hard stop before publish.
- **Dry-run mode** exercises the graph without LLM API keys.

Radar automation, PostgreSQL persistence, and LiteLLM routing land in later slices.

## Setup

```bash
cd editorial-runtime
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

Optional LLM extras (not required for dry-run):

```bash
pip install -e ".[dev,llm]"
export OPENAI_API_KEY=...  # or provider of choice
```

## Usage

From the repository root:

```bash
ps-editorial run --topic "MCP for platform engineers" --persona maya --dry-run
ps-editorial assemble-context --persona maya --brief editorial/briefs/PS-000008.yml
pytest
```

Dry-run writes workflow state under `editorial-runtime/runs/` (gitignored).

## Layout

```text
editorial-runtime/
  editorial_runtime/   # workflow, models, CLI
  tests/
agents/author/         # persona packages (repo root)
```

## Model routing (planned)

Capability aliases — not per-persona models: `research`, `reasoning`, `writer`, `fast`, `local`. See `config/models.example.yaml`.
