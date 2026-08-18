from pathlib import Path

import pytest

from editorial_runtime.agents.author import (
    AUTHOR_INSTRUCTIONS,
    author_revision_block,
    story_constraints_block,
    unwrap_mdx,
)
from editorial_runtime.models import (
    ArticleBrief,
    ContentType,
    EvidenceOutcome,
    EvidenceReview,
    PersonaName,
    WorkflowStage,
    WorkflowState,
)
from editorial_runtime.nodes import author_draft, route_after_evidence
from editorial_runtime.sources import load_source_pack
from editorial_runtime.repo import find_repo_root
from editorial_runtime.store import InMemoryRunStore
from editorial_runtime.workflow import revise_workflow


def test_load_source_pack_includes_mcp_spec():
    root = find_repo_root(Path(__file__).resolve().parents[2])
    pack = load_source_pack(["SRC-MCP-001"], root=root)
    assert "SRC-MCP-001" in pack
    assert "modelcontextprotocol.io" in pack


def test_revision_cap_sends_hold_to_human_gate():
    state = WorkflowState(
        workflow_id="test",
        topic="MCP",
        assigned_persona=PersonaName.maya,
        revision_count=1,
        max_revisions=1,
        evidence_review=EvidenceReview(
            editor_status=EvidenceOutcome.pass_with_changes,
            confidence=50,
            summary="needs sources",
        ),
    )
    assert route_after_evidence(state) == "human_gate"


def test_first_pass_with_changes_routes_to_revision():
    state = WorkflowState(
        workflow_id="test",
        topic="MCP",
        assigned_persona=PersonaName.maya,
        revision_count=0,
        max_revisions=1,
        evidence_review=EvidenceReview(
            editor_status=EvidenceOutcome.pass_with_changes,
            confidence=50,
            summary="needs sources",
        ),
    )
    assert route_after_evidence(state) == "revision"


def _brief() -> ArticleBrief:
    return ArticleBrief(
        article_id="PS-000010",
        opportunity_id="PS-O-0010",
        working_title="What Is Agentic Platform Engineering?",
        content_type=ContentType.explainer,
        author_persona=PersonaName.maya,
        target_reader=["platform engineers"],
        primary_question="What stays human?",
        reader_problem="The term is undefined.",
        central_thesis="Agents may assist. They must not own the control plane.",
        why_now="Rebranding without a definition.",
        unique_angle="Which platform jobs stay human.",
        required_sections=["why this matters", "definition", "recommendation"],
        required_visuals=["deferred"],
        target_length=1600,
        research_review="strongly_recommended",
    )


def test_revision_block_empty_on_first_pass():
    state = WorkflowState(
        workflow_id="test",
        topic="x",
        assigned_persona=PersonaName.maya,
        brief=_brief(),
        draft_mdx="<Figure src='deferred-visual' />",
        revision_count=0,
    )
    assert author_revision_block(state) == ""


def test_revision_block_includes_draft_and_human_notes():
    state = WorkflowState(
        workflow_id="test",
        topic="x",
        assigned_persona=PersonaName.maya,
        brief=_brief(),
        draft_mdx="<Figure src='deferred-visual' />\nToo short.",
        revision_count=1,
        revision_notes="Remove all Figure tags. Hit 1600 words.",
        evidence_review=EvidenceReview(
            editor_status=EvidenceOutcome.hold,
            confidence=60,
            summary="Missing figure deferred-visual",
        ),
    )
    block = author_revision_block(state)
    assert "deferred-visual" in block
    assert "Remove all Figure tags" in block
    assert "1600" in block
    assert "Missing figure" in block
    assert "Do not replace a finished article with an outline" in block
    assert "em dashes" in block


def test_revise_workflow_rejects_missing_run_and_empty_notes():
    store = InMemoryRunStore()
    with pytest.raises(ValueError, match="No run found"):
        revise_workflow(
            workflow_id="missing",
            runs_dir=Path("/tmp"),
            notes="rewrite",
            store=store,
        )

    state = WorkflowState(
        workflow_id="run-1",
        topic="x",
        assigned_persona=PersonaName.maya,
        brief=_brief(),
        draft_mdx="# stub\n",
        dry_run=True,
        stage=WorkflowStage.human_gate,
    )
    store.save(state)
    with pytest.raises(ValueError, match="revision notes are required"):
        revise_workflow(
            workflow_id="run-1",
            runs_dir=Path("/tmp"),
            notes="   ",
            store=store,
        )


def test_dry_run_revise_returns_to_human_gate(tmp_path: Path):
    store = InMemoryRunStore()
    state = WorkflowState(
        workflow_id="run-2",
        topic="What Is Agentic Platform Engineering?",
        assigned_persona=PersonaName.maya,
        brief=_brief(),
        draft_mdx="<Figure src='deferred-visual' />\n",
        dry_run=True,
        stage=WorkflowStage.human_gate,
        evidence_review=EvidenceReview(
            editor_status=EvidenceOutcome.hold,
            confidence=60,
            summary="Missing figure deferred-visual",
        ),
    )
    store.save(state)
    revised = revise_workflow(
        workflow_id="run-2",
        runs_dir=tmp_path,
        notes="Remove all Figure tags. Hit the brief length.",
        store=store,
    )
    assert revised.stage == WorkflowStage.human_gate
    assert revised.revision_count == 1
    assert revised.revision_notes is not None
    assert "Figure" in revised.revision_notes
    assert revised.draft_path is not None
    assert Path(revised.draft_path).is_file()


def test_author_instructions_forbid_em_dashes():
    assert "em dashes" in AUTHOR_INSTRUCTIONS


def test_author_draft_keeps_previous_article_when_llm_fails(tmp_path, monkeypatch):
    previous = "# What Is Agentic Platform Engineering?\n\nKeep this finished article.\n"
    state = WorkflowState(
        workflow_id="keep-1",
        topic="x",
        assigned_persona=PersonaName.maya,
        brief=_brief(),
        draft_mdx=previous,
        outline="# Outline: What Is Agentic Platform Engineering?\n",
        dry_run=False,
        use_test_model=True,
        revision_count=1,
    )

    def boom(*args, **kwargs):
        raise RuntimeError("'str' object has no attribute 'outline'")

    monkeypatch.setattr("editorial_runtime.agents.author.run_author_draft", boom)
    out = author_draft(state, tmp_path)
    assert "Keep this finished article" in (out.draft_mdx or "")
    assert "Outline:" not in (out.draft_mdx or "")
    assert any("author LLM failed" in err for err in out.errors)
    assert Path(out.draft_path or "").is_file()


def test_author_draft_falls_back_to_outline_without_previous(tmp_path, monkeypatch):
    state = WorkflowState(
        workflow_id="first-fail",
        topic="x",
        assigned_persona=PersonaName.maya,
        brief=_brief(),
        outline="# Outline: first pass\n",
        dry_run=False,
        use_test_model=True,
    )

    def boom(*args, **kwargs):
        raise RuntimeError("writer unavailable")

    monkeypatch.setattr("editorial_runtime.agents.author.run_author_draft", boom)
    out = author_draft(state, tmp_path)
    assert "Outline: first pass" in (out.draft_mdx or "")
    assert any("author LLM failed" in err for err in out.errors)


def test_unwrap_mdx_strips_fences_and_leaves_plain_prose():
    fenced = "```mdx\n## Why This Matters\n\nBody.\n```"
    assert unwrap_mdx(fenced) == "## Why This Matters\n\nBody."
    assert unwrap_mdx("## Why This Matters") == "## Why This Matters"


def test_story_constraints_name_the_reader_problem():
    block = story_constraints_block(_brief())
    assert "The term is undefined." in block
    assert "Hold this thesis" in block
    assert "Agents may assist" in block
    assert "Cite approved sources only" in block


