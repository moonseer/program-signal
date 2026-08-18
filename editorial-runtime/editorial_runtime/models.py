"""Typed contracts aligned with repo YAML schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class PersonaName(str, Enum):
    marcus = "marcus"
    maya = "maya"
    elias = "elias"
    nia = "nia"


class ContentType(str, Enum):
    deep_dive = "deep_dive"
    operator_guide = "operator_guide"
    the_signal = "the_signal"
    field_note = "field_note"
    lab = "lab"
    explainer = "explainer"
    decision_guide = "decision_guide"
    roundtable = "roundtable"
    reference_architecture = "reference_architecture"


class EditorialDecisionStatus(str, Enum):
    APPROVE = "APPROVE"
    APPROVE_WITH_REFRAMING = "APPROVE WITH REFRAMING"
    HOLD = "HOLD"
    MERGE = "MERGE"
    REJECT = "REJECT"
    WATCH = "WATCH"


class EvidenceOutcome(str, Enum):
    pass_ = "pass"
    pass_with_changes = "pass_with_changes"
    hold = "hold"
    fail = "fail"


class EditorialDecision(BaseModel):
    status: EditorialDecisionStatus
    reason: str
    content_type: ContentType
    author_persona: PersonaName
    secondary_perspective: PersonaName | None = None
    central_thesis: str
    research_review: Literal["mandatory", "strongly_recommended", "optional"] = (
        "strongly_recommended"
    )


class ArticleBrief(BaseModel):
    model_config = {"extra": "ignore"}
    article_id: str = Field(pattern=r"^PS-\d{6}$")
    opportunity_id: str | None = Field(default=None, pattern=r"^PS-O-\d{4}$")
    working_title: str
    content_type: ContentType
    author_persona: PersonaName
    secondary_perspective: PersonaName | None = None
    target_reader: list[str]
    primary_question: str
    reader_problem: str
    central_thesis: str
    why_now: str
    unique_angle: str
    required_sections: list[str]
    claims_to_verify: list[str] = Field(default_factory=list)
    required_visuals: list[str] = Field(default_factory=list)
    target_length: int = Field(gt=0)
    research_review: Literal["mandatory", "strongly_recommended", "optional"]
    editorial_decision: EditorialDecisionStatus | None = None


class ClaimReview(BaseModel):
    claim_id: str = Field(pattern=r"^C\d{3}$")
    status: Literal["VERIFIED", "SUPPORTED", "CONTESTED", "UNSUPPORTED", "INCORRECT"]
    note: str


class EvidenceReview(BaseModel):
    editor_status: EvidenceOutcome
    confidence: int = Field(ge=0, le=100)
    claim_reviews: list[ClaimReview] = Field(default_factory=list)
    summary: str


class AuthorDraftOutput(BaseModel):
    outline: str
    draft_mdx: str = Field(
        description="MDX article body. Frontmatter is added by the workflow.",
    )


class ModelUsageRecord(BaseModel):
    agent: str
    capability: str
    model: str
    workflow_stage: str


class WorkflowStage(str, Enum):
    topic = "topic"
    desk = "desk"
    brief = "brief"
    author_outline = "author_outline"
    author_draft = "author_draft"
    evidence = "evidence"
    revision = "revision"
    human_gate = "human_gate"
    publish = "publish"


class WorkflowState(BaseModel):
    workflow_id: str
    workflow_version: str = "0.1.0"
    topic: str
    stage: WorkflowStage = WorkflowStage.topic
    assigned_persona: PersonaName
    persona_version: str = "1.0.0"
    dry_run: bool = True
    use_test_model: bool = False
    desk_decision: EditorialDecision | None = None
    brief: ArticleBrief | None = None
    outline: str | None = None
    draft_path: str | None = None
    draft_mdx: str | None = None
    evidence_review: EvidenceReview | None = None
    human_status: Literal["pending", "approved", "rejected"] = "pending"
    model_usage: list[ModelUsageRecord] = Field(default_factory=list)
    revision_count: int = 0
    max_revisions: int = 1
    source_ids: list[str] = Field(default_factory=list)
    brief_path: str | None = None
    errors: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def touch(self) -> None:
        self.updated_at = datetime.now(timezone.utc)
