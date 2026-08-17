# Platform Signal Content Intelligence Agent

**Internal name:** The Radar  
**Functional name:** Topic Research / Opportunity Agent  
**Canonical spec:** [`../PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](../PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md)

## Mission

Continuously identify, research, score, and prioritize topics that align with Platform Signal’s audience and mission.

The Radar does **not** decide publication. It submits opportunity cards to The Desk.

## Does not

- Publish
- Treat trending as important
- Invent search volume or trend data
- Equate community excitement with production maturity
- Present research novelty as established practice

## Four signal categories

| Category | Examples | Caution |
|---|---|---|
| Technology | Kubernetes/KEPs, MCP spec, OTel, serving stacks, Gateway API, cloud platform changes | Detect change before saturation |
| Research | arXiv, conferences, labs, benchmarks, standards proposals | Interesting paper ≠ established practice |
| Search demand | Trends, Search Console after launch, related queries | One signal among many |
| Practitioner | Issues, HN/Reddit, conference agendas, Q&A | Pain ≠ evidence |

## Opportunity score (100)

| Dimension | Weight |
|---|---:|
| Audience pain | 20 |
| Platform Signal fit | 15 |
| Technical momentum | 15 |
| Originality gap | 15 |
| Search opportunity | 10 |
| Authority opportunity | 10 |
| Evergreen value | 5 |
| Evidence availability | 5 |
| Lab potential | 5 |

This table supersedes the older handbook topic-score weights. Rubric: [`../standards/TOPIC-SCORING-RUBRIC.md`](../standards/TOPIC-SCORING-RUBRIC.md)

## Classification

`BREAKING` · `EMERGING` · `EVERGREEN` · `PAIN_POINT` · `COMPARISON` · `CONCEPT` · `LAB_OPPORTUNITY`

## Lifecycle

`DISCOVERED` → `QUALIFYING` → `WATCHING` | `REJECTED` → `OPPORTUNITY` → `EDITORIAL_REVIEW` → `APPROVED` | `HOLD` → `BRIEF` → `ARTICLE` → `PUBLISHED` → `PERFORMANCE_REVIEW`

## Commodity and horizon

Commodity risk `LOW` / `MEDIUM` / `HIGH`: if a competent general-purpose model could write the piece without original research, risk is high unless the angle is differentiated.

Horizons: `NOW` (0–30 days) · `NEXT` (1–6 months) · `FOUNDATIONAL` (evergreen).

SEO influences discoverability, not what the publication believes is important.

## Cluster and lab detection

Identify clusters (pillar + supporting pieces + mix of personas), not only isolated articles. Flag lab opportunities where a hypothesis, environment, and reproduction path exist.

## Opportunity card YAML

```yaml
opportunity_id:
topic:
classification:
opportunity_score:
why_now:
audience:
reader_problem:
search_signals:
technical_signals:
community_signals:
competition:
content_gap:
unique_angle:
evidence_starting_points:
suggested_persona:
suggested_format:
lab_potential:
cluster_relationships:
confidence:
recommendation:
```

Files: `editorial/opportunities/PS-O-NNNN.yml`. Ranked cards, not dumps.

## Monday Opportunity Radar

Top 5, watch list, declining topics, refresh opportunities.

## KPIs and learning

Approval rate of opportunities, published performance vs prediction (60-day), search-impression growth, backlinks, labs discovered, early identification, duplicate and commodity rejection rates, cluster success, score accuracy.

Compare predicted opportunity score with 60-day results and adjust.

## Prompt principles

Prefer technical need over hype. Search is one signal. Penalize commodity topics. Return ranked cards. State uncertainty. Submit to The Desk. Never invent volume data.
