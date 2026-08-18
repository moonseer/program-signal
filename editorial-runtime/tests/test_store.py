import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from editorial_runtime.models import PersonaName, WorkflowStage, WorkflowState
from editorial_runtime.store import (
    InMemoryRunStore,
    JsonFileRunStore,
    PostgresRunStore,
    open_run_store,
)
from editorial_runtime.workflow import run_workflow


def _state(workflow_id: str, *, stage: WorkflowStage = WorkflowStage.human_gate) -> WorkflowState:
    now = datetime.now(timezone.utc)
    return WorkflowState(
        workflow_id=workflow_id,
        topic="MCP for platform engineers",
        assigned_persona=PersonaName.maya,
        stage=stage,
        updated_at=now,
        created_at=now,
    )


def test_memory_save_and_get():
    store = InMemoryRunStore()
    store.setup()
    original = _state("run-happy")
    store.save(original)
    loaded = store.get("run-happy")
    assert loaded is not None
    assert loaded.topic == original.topic
    assert loaded.stage == WorkflowStage.human_gate


def test_memory_get_missing_returns_none():
    store = InMemoryRunStore()
    store.setup()
    assert store.get("does-not-exist") is None


def test_memory_list_filters_stage_and_limit():
    store = InMemoryRunStore()
    older = _state("run-old", stage=WorkflowStage.evidence)
    older.updated_at = datetime.now(timezone.utc) - timedelta(minutes=5)
    newer = _state("run-new", stage=WorkflowStage.human_gate)
    store.save(older)
    store.save(newer)
    listed = store.list(stage="human_gate", limit=1)
    assert len(listed) == 1
    assert listed[0].workflow_id == "run-new"
    assert store.list(stage="desk") == []


def test_json_file_roundtrip(tmp_path: Path):
    store = JsonFileRunStore(tmp_path)
    store.setup()
    store.save(_state("file-run"))
    loaded = store.get("file-run")
    assert loaded is not None
    assert loaded.workflow_id == "file-run"
    store.save(_state("file-run", stage=WorkflowStage.evidence))
    assert store.get("file-run").stage == WorkflowStage.evidence
    assert [row.workflow_id for row in store.list()] == ["file-run"]


def test_json_file_skips_unrelated_json(tmp_path: Path):
    store = JsonFileRunStore(tmp_path)
    store.setup()
    (tmp_path / "noise.json").write_text('{"not": "a workflow"}', encoding="utf-8")
    store.save(_state("kept"))
    assert [row.workflow_id for row in store.list()] == ["kept"]


def test_open_run_store_uses_json_without_database_url(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.delenv("PS_DATABASE_URL", raising=False)
    store = open_run_store(runs_dir=tmp_path)
    assert isinstance(store, JsonFileRunStore)


@pytest.mark.skipif(not os.getenv("DATABASE_URL") and not os.getenv("PS_DATABASE_URL"), reason="Postgres not configured")
def test_postgres_save_get_list_and_update():
    from uuid import uuid4

    url = os.getenv("PS_DATABASE_URL") or os.getenv("DATABASE_URL")
    store = PostgresRunStore(url)
    store.setup()
    workflow_id = f"pg-{uuid4()}"
    first = _state(workflow_id)
    store.save(first)
    loaded = store.get(workflow_id)
    assert loaded is not None
    assert loaded.topic == first.topic
    updated = _state(workflow_id, stage=WorkflowStage.evidence)
    store.save(updated)
    assert store.get(workflow_id).stage == WorkflowStage.evidence
    listed = store.list(stage="evidence")
    assert any(row.workflow_id == workflow_id for row in listed)
    assert store.get("missing-run") is None
    store.close()


def test_postgres_invalid_url_fails_fast():
    store = PostgresRunStore(
        "postgresql://nobody:wrong@127.0.0.1:1/none?connect_timeout=1",
    )
    with pytest.raises(Exception):
        store.setup()


def test_workflow_persists_to_store(tmp_path: Path):
    store = InMemoryRunStore()
    root = Path(__file__).resolve().parents[2]
    state = run_workflow(
        topic="MCP for platform engineers",
        persona=PersonaName.maya,
        dry_run=True,
        runs_dir=tmp_path,
        store=store,
        brief_path=root / "editorial" / "briefs" / "PS-000008.yml",
    )
    saved = store.get(state.workflow_id)
    assert saved is not None
    assert saved.stage == WorkflowStage.human_gate
    assert saved.draft_mdx is not None
    assert saved.brief is not None
    assert saved.brief.article_id == "PS-000008"
