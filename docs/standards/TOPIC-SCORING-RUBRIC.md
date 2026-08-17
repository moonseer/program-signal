# Topic scoring rubric

Two scores. Two owners. They are allowed to disagree.

Canonical weights: [`PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](../PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md) §§5 and 26. This document **supersedes** the older handbook topic-score weights.

Search demand is one signal. It does not define editorial importance. If Radar scores search high and Desk rejects on fit, **fit wins**.

---

## Radar — opportunity score (100)

Owner: Topic Research / Opportunity Agent. Answers: does this deserve *attention*?

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
| **Total** | **100** |

Output: `editorial/opportunities/PS-O-NNNN.yml`. Radar does not publish.

Also record: classification, lifecycle, `commodity_risk` (`LOW` / `MEDIUM` / `HIGH`), horizon (`NOW` / `NEXT` / `FOUNDATIONAL`).

Never invent search volume or trend data. Pain ≠ evidence. Research novelty ≠ established practice.

---

## Desk — editorial-fit score (100)

Owner: Editorial Agent / Managing Editor. Answers: does this deserve *publication*, in this form, in this voice?

| Dimension | Weight |
|---|---:|
| Reader value | 20 |
| Platform Signal fit | 20 |
| Originality | 15 |
| Technical depth potential | 15 |
| Timeliness | 10 |
| Evergreen value | 10 |
| Evidence availability | 5 |
| Internal-link value | 5 |
| **Total** | **100** |

Decisions: `APPROVE` · `APPROVE_WITH_REFRAMING` · `HOLD` · `MERGE` · `REJECT` · `WATCH`.

A high opportunity score is not an approval.

---

## Evidence is not a score

The Evidence Editor does not re-score the topic. It verifies claims. The Desk must not override `HOLD` / `FAIL` / incomplete `PASS WITH CHANGES`.
