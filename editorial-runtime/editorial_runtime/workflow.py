"""LangGraph editorial workflow."""

from __future__ import annotations

from pathlib import Path
from typing import Any
from uuid import uuid4

from langgraph.graph import END, StateGraph

from editorial_runtime.models import PersonaName, WorkflowStage, WorkflowState
from editorial_runtime import nodes


def build_workflow(*, runs_dir: Path) -> Any:
    graph: StateGraph = StateGraph(WorkflowState)

    def draft_node(state: WorkflowState) -> WorkflowState:
        return nodes.author_draft(state, runs_dir)

    graph.add_node("desk", nodes.desk_review)
    graph.add_node("brief", nodes.create_brief)
    graph.add_node("outline", nodes.author_outline)
    graph.add_node("draft", draft_node)
    graph.add_node("evidence", nodes.evidence_review)
    graph.add_node("revision", nodes.revision)
    graph.add_node("human_gate", nodes.human_gate)

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
) -> WorkflowState:
    app = build_workflow(runs_dir=runs_dir)
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
    final = app.invoke(initial)
    if isinstance(final, WorkflowState):
        return final
    return WorkflowState.model_validate(final)
