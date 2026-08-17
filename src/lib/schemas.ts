import { z } from "zod";

export const contentTypeSchema = z.enum([
  "deep_dive",
  "operator_guide",
  "the_signal",
  "field_note",
  "lab",
  "explainer",
  "decision_guide",
  "roundtable",
  "reference_architecture",
]);

export const authorPersonaSchema = z.enum([
  "marcus",
  "maya",
  "elias",
  "nia",
  "founder",
]);

export const freshnessStatusSchema = z.enum([
  "CURRENT",
  "REVIEW_DUE",
  "STALE",
  "ARCHIVED",
]);

export const editorialWorkflowSchema = z.enum([
  "draft",
  "in_review",
  "approved",
  "published",
]);

export const difficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

export const researchStatusSchema = z.enum([
  "not_required",
  "pending",
  "pass",
  "pass_with_changes",
  "hold",
  "fail",
]);

export const articleFrontmatterSchema = z.object({
  id: z.string().regex(/^PS-\d{6}$/),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  subtitle: z.string().optional(),
  contentType: contentTypeSchema,
  authorPersona: authorPersonaSchema,
  editorialStatus: editorialWorkflowSchema,
  status: freshnessStatusSchema,
  editorialPriority: z.enum(["low", "medium", "high"]).optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastReviewedAt: z.string().optional(),
  reviewAfter: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).max(5).default([]),
  concepts: z.array(z.string()).default([]),
  technologyVersions: z.record(z.string()).default({}),
  difficulty: difficultySchema,
  opportunityId: z.string().regex(/^PS-O-\d{4}$/).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      primaryQuery: z.string().optional(),
      searchIntent: z.string().optional(),
    })
    .optional(),
  research: z
    .object({
      editorStatus: researchStatusSchema,
      confidence: z.number().min(0).max(100).optional(),
      evidenceLedger: z.string().optional(),
    })
    .optional(),
  codeVerification: z
    .object({
      status: z.enum(["unverified", "verified", "failed"]),
      testedAt: z.string().optional(),
    })
    .optional(),
  reproducibility: z
    .object({
      level: z.number().int().min(0).max(4),
    })
    .optional(),
  corrections: z
    .array(
      z.object({
        date: z.string(),
        severity: z.enum(["minor", "clarification", "material", "retraction"]),
        summary: z.string(),
        sectionsAffected: z.array(z.string()).optional(),
      }),
    )
    .default([]),
  relationships: z
    .object({
      relatedArticles: z.array(z.string()).default([]),
      series: z.string().optional(),
      sources: z.array(z.string()).default([]),
      diagrams: z.array(z.string().regex(/^PS-D-\d{4}$/)).default([]),
    })
    .default({
      relatedArticles: [],
      sources: [],
      diagrams: [],
    }),
  sponsorship: z
    .object({
      sponsored: z.boolean(),
      affiliateLinks: z.boolean(),
    })
    .default({ sponsored: false, affiliateLinks: false }),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export const opportunityClassificationSchema = z.enum([
  "BREAKING",
  "EMERGING",
  "EVERGREEN",
  "PAIN_POINT",
  "COMPARISON",
  "CONCEPT",
  "LAB_OPPORTUNITY",
]);

export const opportunityLifecycleSchema = z.enum([
  "DISCOVERED",
  "QUALIFYING",
  "WATCHING",
  "REJECTED",
  "OPPORTUNITY",
  "EDITORIAL_REVIEW",
  "APPROVED",
  "HOLD",
  "BRIEF",
  "ARTICLE",
  "PUBLISHED",
  "PERFORMANCE_REVIEW",
]);

export const editorialDecisionSchema = z.enum([
  "APPROVE",
  "APPROVE_WITH_REFRAMING",
  "HOLD",
  "MERGE",
  "REJECT",
  "WATCH",
]);

export const opportunityCardSchema = z.object({
  opportunity_id: z.string().regex(/^PS-O-\d{4}$/),
  topic: z.string().min(1),
  classification: opportunityClassificationSchema,
  lifecycle: opportunityLifecycleSchema,
  opportunity_score: z.number().min(0).max(100),
  commodity_risk: z.enum(["LOW", "MEDIUM", "HIGH"]),
  horizon: z.enum(["NOW", "NEXT", "FOUNDATIONAL"]),
  why_now: z.string().min(1),
  audience: z.array(z.string()).min(1),
  reader_problem: z.string().min(1),
  search_signals: z.string().optional(),
  technical_signals: z.string().optional(),
  community_signals: z.string().optional(),
  competition: z.string().optional(),
  content_gap: z.string().min(1),
  unique_angle: z.string().min(1),
  evidence_starting_points: z.array(z.string()).default([]),
  suggested_persona: authorPersonaSchema,
  suggested_format: contentTypeSchema,
  lab_potential: z.enum(["none", "low", "medium", "high", "very_high"]).optional(),
  cluster_relationships: z.array(z.string()).default([]),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]),
  recommendation: z.string().min(1),
});

export const articleBriefSchema = z.object({
  article_id: z.string().regex(/^PS-\d{6}$/),
  opportunity_id: z.string().regex(/^PS-O-\d{4}$/).optional(),
  working_title: z.string().min(1),
  content_type: contentTypeSchema,
  author_persona: authorPersonaSchema,
  secondary_perspective: authorPersonaSchema.optional(),
  target_reader: z.array(z.string()).min(1),
  primary_question: z.string().min(1),
  reader_problem: z.string().min(1),
  central_thesis: z.string().min(1),
  why_now: z.string().min(1),
  unique_angle: z.string().min(1),
  required_sections: z.array(z.string()).min(1),
  claims_to_verify: z.array(z.string()).default([]),
  required_visuals: z.array(z.string()).default([]),
  target_length: z.number().int().positive(),
  research_review: z.enum(["mandatory", "strongly_recommended", "optional"]),
  editorial_decision: editorialDecisionSchema.optional(),
  primary_keyword: z.string().optional(),
  secondary_keywords: z.array(z.string()).optional(),
  refresh_cycle: z.number().int().optional(),
});

export const REQUIRED_RESEARCH_TYPES: ArticleFrontmatter["contentType"][] = [
  "deep_dive",
  "operator_guide",
  "lab",
  "reference_architecture",
];

export const claimTypeSchema = z.enum([
  "FACT",
  "ANALYSIS",
  "INFERENCE",
  "OPINION",
  "PREDICTION",
]);

export const claimStatusSchema = z.enum([
  "VERIFIED",
  "SUPPORTED",
  "CONTESTED",
  "UNSUPPORTED",
  "INCORRECT",
]);

export const evidenceClaimSchema = z.object({
  id: z.string().regex(/^C\d{3}$/),
  claim: z.string().min(1),
  type: claimTypeSchema,
  status: claimStatusSchema,
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  sources: z
    .array(
      z.object({
        title: z.string().min(1),
        org: z.string().optional(),
        url: z.string().url().optional(),
        date: z.string().optional(),
        tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
      }),
    )
    .default([]),
});

export const evidenceLedgerSchema = z.object({
  article: z.string().min(1),
  reviewed: z.preprocess(
    (value) =>
      value instanceof Date ? value.toISOString().slice(0, 10) : value,
    z.string().optional(),
  ),
  claims: z.array(evidenceClaimSchema).default([]),
});

export const sourceRecordSchema = z.object({
  source_id: z.string().regex(/^SRC-/),
  title: z.string().min(1),
  organization: z.string().optional(),
  url: z.string().url().optional(),
  type: z.string().optional(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  topics: z.array(z.string()).default([]),
  published_at: z.string().optional(),
  updated_at: z.string().optional(),
  license: z.string().optional(),
  doi: z.string().optional(),
  notes: z.string().optional(),
});

export const sourceLibrarySchema = z.object({
  sources: z.array(sourceRecordSchema).default([]),
});

export const sourceCollectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const sourceTaxonomySchema = z.object({
  collections: z.array(sourceCollectionSchema).min(1),
});

export const publicReferenceLabelSchema = z.enum([
  "PRIMARY_SOURCE",
  "SPECIFICATION",
  "RESEARCH",
  "VENDOR_DOCUMENTATION",
  "SECONDARY_ANALYSIS",
]);

export const publicReferenceSchema = z.object({
  source_id: z.string().regex(/^SRC-/),
  label: publicReferenceLabelSchema,
  note: z.string().optional(),
  section: z.string().optional(),
  version: z.string().optional(),
});

export const publicReferencesFileSchema = z.object({
  references: z.array(publicReferenceSchema).default([]),
});

export const diagramTypeSchema = z.enum([
  "architecture",
  "sequence",
  "decision_tree",
  "failure_flow",
  "data_flow",
  "control_plane",
  "dependency_map",
  "incident_timeline",
]);

export const diagramMetadataSchema = z.object({
  id: z.string().regex(/^PS-D-\d{4}$/),
  title: z.string().min(1),
  article_id: z.string().regex(/^PS-\d{6}$/),
  type: diagramTypeSchema,
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
  source_format: z.enum(["mermaid", "svg"]),
  license: z.string().min(1),
  alt_text: z.string().min(1),
  question: z.string().min(1),
  omissions: z.string().optional(),
  technology_versions: z.record(z.string()).default({}),
});

export const sequentialKindSchema = z.enum([
  "article",
  "opportunity",
  "diagram",
  "lab",
]);

export const idRegistrySchema = z.object({
  next: z.object({
    article: z.number().int().positive(),
    opportunity: z.number().int().positive(),
    diagram: z.number().int().positive(),
    lab: z.number().int().positive(),
  }),
  source_families: z.record(z.number().int().positive()).default({}),
});

export const clusterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  pillar: z.string().optional(),
  pillar_opportunity: z.string().regex(/^PS-O-\d{4}$/).optional(),
  articles: z.array(z.string().regex(/^PS-\d{6}$/)).default([]),
  opportunities: z.array(z.string().regex(/^PS-O-\d{4}$/)).default([]),
});

export const clustersFileSchema = z.object({
  clusters: z.array(clusterSchema).default([]),
});

export const watchlistFileSchema = z.object({
  items: z.array(z.unknown()).default([]),
});

export const calendarFileSchema = z.object({
  week_of: z.string().min(1),
  items: z.array(z.unknown()).default([]),
  persona_workload: z.record(z.unknown()).default({}),
  topic_mix: z.record(z.unknown()).default({}),
  content_type_mix: z.record(z.unknown()).default({}),
});

export type SequentialKind = z.infer<typeof sequentialKindSchema>;
export type IdRegistry = z.infer<typeof idRegistrySchema>;
export type SourceRecord = z.infer<typeof sourceRecordSchema>;
export type PublicReference = z.infer<typeof publicReferenceSchema>;
