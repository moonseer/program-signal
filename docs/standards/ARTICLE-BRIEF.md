# Article brief

Thinking happens here. Writing happens after.

Canonical brief: `editorial/briefs/PS-NNNNNN.yml` (Desk output). Copy into `content/articles/<slug>/brief.yml` when drafting starts.

Schema: `articleBriefSchema` in `src/lib/schemas.ts`. Template: `content/_templates/brief.yml`.

An article does not move to drafting unless audience, thesis, unique value, evidence, cluster, persona, and type are set.

---

## Required fields (Desk / agent contract)

From [`PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](../PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md) §9:

| Field | Purpose |
|---|---|
| `article_id` | `PS-NNNNNN` |
| `opportunity_id` | `PS-O-NNNN` when the piece came from The Radar |
| `working_title` | Working title, not a keyword stuffed slug |
| `content_type` | See [`CONTENT-TYPES.md`](./CONTENT-TYPES.md) |
| `author_persona` | Primary voice |
| `secondary_perspective` | Optional second question (does not replace Evidence Editor) |
| `target_reader` | Specific roles, not “engineers” |
| `primary_question` | The question the piece answers |
| `reader_problem` | Why the reader cares |
| `central_thesis` | Editorial hypothesis |
| `why_now` | Timing |
| `unique_angle` | What only Platform Signal is saying |
| `required_sections` | Outline the writer must hit |
| `claims_to_verify` | Handed to the Evidence Editor |
| `required_visuals` | Diagrams/figures, or explicitly deferred |
| `target_length` | Words |
| `research_review` | `mandatory` · `strongly_recommended` · `optional` |
| `editorial_decision` | Desk status |

## Handbook extras (keep when they help)

`primary_keyword`, `secondary_keywords`, `search_intent`, competing content, production/security questions, `internal_links`, `refresh_cycle`, `target_publish_date`.

Keywords describe discoverability. They do not replace a thesis.

---

## Approval gate

Do not draft until:

- Audience is specific
- Thesis is clear
- Unique value is identified
- Evidence appears obtainable
- Article fits a cluster (or the cluster gap is named)
- Author persona fits
- Article type is defined

---

## Failure modes

**Keyword-first brief**

Bad: `primary_keyword: AI agents Kubernetes`  
Good: the reader needs to understand which cluster permissions an operational agent should receive, and why.

**Thesis-free brief**

Bad: `Explain DRA.`  
Good: explain why DRA changes the resource contract between Kubernetes workloads and specialized hardware, then identify when platform teams should migrate.

---

## Desk return to Radar

When The Desk answers an opportunity card:

```yaml
opportunity_id:
editorial_decision:   # APPROVE | APPROVE_WITH_REFRAMING | HOLD | MERGE | REJECT | WATCH
reason:
final_angle:
content_type:
author_persona:
secondary_reviewer:
target_reader:
central_thesis:
required_sections:
required_evidence:
required_visuals:
target_length:
research_review_level:
priority:
publish_window:
```
