"""Persist editorial workflow runs.

PostgreSQL is the canonical store. When DATABASE_URL / PS_DATABASE_URL is unset,
runs fall back to JSON files under editorial-runtime/runs/ (local/dev only).
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Protocol

from editorial_runtime.models import WorkflowState

SCHEMA_STATEMENTS = (
    """
    CREATE TABLE IF NOT EXISTS workflow_runs (
        workflow_id TEXT PRIMARY KEY,
        workflow_version TEXT NOT NULL,
        topic TEXT NOT NULL,
        stage TEXT NOT NULL,
        assigned_persona TEXT NOT NULL,
        human_status TEXT NOT NULL,
        article_id TEXT,
        draft_mdx TEXT,
        state JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
    )
    """,
    """
    CREATE INDEX IF NOT EXISTS workflow_runs_stage_updated_idx
        ON workflow_runs (stage, updated_at DESC)
    """,
    """
    CREATE INDEX IF NOT EXISTS workflow_runs_updated_idx
        ON workflow_runs (updated_at DESC)
    """,
)

UPSERT_SQL = """
INSERT INTO workflow_runs (
    workflow_id, workflow_version, topic, stage, assigned_persona,
    human_status, article_id, draft_mdx, state, created_at, updated_at
) VALUES (
    %(workflow_id)s, %(workflow_version)s, %(topic)s, %(stage)s, %(assigned_persona)s,
    %(human_status)s, %(article_id)s, %(draft_mdx)s, %(state)s, %(created_at)s, %(updated_at)s
)
ON CONFLICT (workflow_id) DO UPDATE SET
    workflow_version = EXCLUDED.workflow_version,
    topic = EXCLUDED.topic,
    stage = EXCLUDED.stage,
    assigned_persona = EXCLUDED.assigned_persona,
    human_status = EXCLUDED.human_status,
    article_id = EXCLUDED.article_id,
    draft_mdx = EXCLUDED.draft_mdx,
    state = EXCLUDED.state,
    updated_at = EXCLUDED.updated_at;
"""


class RunStore(Protocol):
    def setup(self) -> None: ...
    def save(self, state: WorkflowState) -> None: ...
    def get(self, workflow_id: str) -> WorkflowState | None: ...
    def list(self, *, stage: str | None = None, limit: int = 50) -> list[WorkflowState]: ...


class InMemoryRunStore:
    def __init__(self) -> None:
        self._runs: dict[str, WorkflowState] = {}

    def setup(self) -> None:
        return None

    def save(self, state: WorkflowState) -> None:
        self._runs[state.workflow_id] = state.model_copy(deep=True)

    def get(self, workflow_id: str) -> WorkflowState | None:
        found = self._runs.get(workflow_id)
        return found.model_copy(deep=True) if found else None

    def list(self, *, stage: str | None = None, limit: int = 50) -> list[WorkflowState]:
        rows = list(self._runs.values())
        if stage:
            rows = [row for row in rows if row.stage.value == stage]
        rows.sort(key=lambda row: row.updated_at, reverse=True)
        return [row.model_copy(deep=True) for row in rows[:limit]]


class JsonFileRunStore:
    """Dev fallback when Postgres is not configured."""

    def __init__(self, runs_dir: Path) -> None:
        self.runs_dir = runs_dir

    def setup(self) -> None:
        self.runs_dir.mkdir(parents=True, exist_ok=True)

    def _path(self, workflow_id: str) -> Path:
        return self.runs_dir / f"{workflow_id}.json"

    def save(self, state: WorkflowState) -> None:
        self.setup()
        self._path(state.workflow_id).write_text(
            json.dumps(state.model_dump(mode="json"), indent=2, default=str) + "\n",
            encoding="utf-8",
        )

    def get(self, workflow_id: str) -> WorkflowState | None:
        path = self._path(workflow_id)
        if not path.is_file():
            return None
        return WorkflowState.model_validate_json(path.read_text(encoding="utf-8"))

    def list(self, *, stage: str | None = None, limit: int = 50) -> list[WorkflowState]:
        self.setup()
        rows: list[WorkflowState] = []
        for path in self.runs_dir.glob("*.json"):
            try:
                rows.append(WorkflowState.model_validate_json(path.read_text(encoding="utf-8")))
            except Exception:  # noqa: BLE001 — skip unrelated JSON in the runs directory
                continue
        if stage:
            rows = [row for row in rows if row.stage.value == stage]
        rows.sort(key=lambda row: row.updated_at, reverse=True)
        return rows[:limit]


class PostgresRunStore:
    def __init__(self, database_url: str) -> None:
        self.database_url = database_url
        self._pool = None

    def setup(self) -> None:
        from psycopg_pool import ConnectionPool

        if self._pool is None:
            self._pool = ConnectionPool(
                conninfo=self.database_url,
                min_size=1,
                max_size=4,
                timeout=5,
                kwargs={"autocommit": True, "connect_timeout": 5},
                open=True,
            )
        with self._pool.connection() as conn:
            for statement in SCHEMA_STATEMENTS:
                conn.execute(statement)

    def close(self) -> None:
        if self._pool is not None:
            self._pool.close()
            self._pool = None

    def _require_pool(self):
        if self._pool is None:
            self.setup()
        return self._pool

    def save(self, state: WorkflowState) -> None:
        from psycopg.types.json import Jsonb

        payload = state.model_dump(mode="json")
        params = {
            "workflow_id": state.workflow_id,
            "workflow_version": state.workflow_version,
            "topic": state.topic,
            "stage": state.stage.value,
            "assigned_persona": state.assigned_persona.value,
            "human_status": state.human_status,
            "article_id": state.brief.article_id if state.brief else None,
            "draft_mdx": state.draft_mdx,
            "state": Jsonb(payload),
            "created_at": state.created_at,
            "updated_at": state.updated_at,
        }
        with self._require_pool().connection() as conn:
            conn.execute(UPSERT_SQL, params)

    def get(self, workflow_id: str) -> WorkflowState | None:
        with self._require_pool().connection() as conn:
            row = conn.execute(
                "SELECT state FROM workflow_runs WHERE workflow_id = %s",
                (workflow_id,),
            ).fetchone()
        if row is None:
            return None
        return WorkflowState.model_validate(row[0])

    def list(self, *, stage: str | None = None, limit: int = 50) -> list[WorkflowState]:
        sql = "SELECT state FROM workflow_runs"
        params: dict[str, object] = {"limit": limit}
        if stage:
            sql += " WHERE stage = %(stage)s"
            params["stage"] = stage
        sql += " ORDER BY updated_at DESC LIMIT %(limit)s"
        with self._require_pool().connection() as conn:
            rows = conn.execute(sql, params).fetchall()
        return [WorkflowState.model_validate(row[0]) for row in rows]


def database_url_from_env() -> str | None:
    for key in ("PS_DATABASE_URL", "DATABASE_URL"):
        value = os.getenv(key)
        if value and value.strip():
            return value.strip()
    return None


def open_run_store(
    *,
    runs_dir: Path,
    database_url: str | None = None,
) -> RunStore:
    url = database_url if database_url is not None else database_url_from_env()
    if url:
        store = PostgresRunStore(url)
        store.setup()
        return store
    store = JsonFileRunStore(runs_dir)
    store.setup()
    return store
