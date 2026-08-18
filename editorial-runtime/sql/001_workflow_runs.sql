-- Editorial runtime workflow state (not used by the public Vercel site).
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
);

CREATE INDEX IF NOT EXISTS workflow_runs_stage_updated_idx
    ON workflow_runs (stage, updated_at DESC);

CREATE INDEX IF NOT EXISTS workflow_runs_updated_idx
    ON workflow_runs (updated_at DESC);
