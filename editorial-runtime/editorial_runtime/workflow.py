"""LangGraph editorial workflow."""

from __future__ import annotations

from pathlib import Path
from typing import Any
from uuid import uuid4

from langgraph.graph import END, StateGraph

from editorial_runtime.models import PersonaName, WorkflowStage, WorkflowState
from editorial_runtime.store import RunStore, open_run_store
from editorial_runtime import nodes


def _as_state(value: Any) -> WorkflowState:
    if isinstance(value, WorkflowState):
        return value
    return WorkflowState.model_validate(value)


def build_workflow(*, runs_dir: Path, store: RunStore) -> Any:
    graph: StateGraph = StateGraph(WorkflowState)

    def persist(node):
        def wrapped(state: Any) -> WorkflowState:
            out = _as_state(node(_as_state(state)))
            store.save(out)
            return out

        return wrapped

    def draft_node(state: WorkflowState) -> WorkflowState:
        return nodes.author_draft(state, runs_dir)

    graph.add_node("desk", persist(nodes.desk_review))
    graph.add_node("brief", persist(nodes.create_brief))
    graph.add_node("outline", persist(nodes.author_outline))
    graph.add_node("draft", persist(draft_node))
    graph.add_node("evidence", persist(nodes.evidence_review))
    graph.add_node("revision", persist(nodes.revision))
    graph.add_node("human_gate", persist(nodes.human_gate))

    graph.set_entry_point("desk")
    graph.add_edge("desk", "brief")
    graph.add_edge("brief", "outline")
    graph.add_edge("outline", "draft")
    graph.add_edge("draft", "evidence")
    graph.add_conditional_edges(
        "evidence",
        nodes.route_after_evidence,
        {"revision": "revision", "human_gate": "human_gate"},
    )
    graph.add_edge("revision", "draft")
    graph.add_edge("human_gate", END)

    return graph.compile()


def run_workflow(
    *,
    topic: str,
    persona: PersonaName,
    dry_run: bool = True,
    use_test_model: bool = False,
    runs_dir: Path,
    brief_path: Path | None = None,
    source_ids: list[str] | None = None,
    max_revisions: int = 1,
    store: RunStore | None = None,
) -> WorkflowState:
    run_store = store or open_run_store(runs_dir=runs_dir)
    run_store.setup()
    app = build_workflow(runs_dir=runs_dir, store=run_store)
    initial = WorkflowState(
        workflow_id=str(uuid4()),
        topic=topic,
        assigned_persona=persona,
        dry_run=dry_run,
        use_test_model=use_test_model,
        stage=WorkflowStage.topic,
        brief_path=str(brief_path) if brief_path else None,
        source_ids=source_ids or ["SRC-MCP-001"],
        max_revisions=max_revisions,
    )
    run_store.save(initial)
    final = app.invoke(initial)
    state = _as_state(final)
    run_store.save(state)
    return state
