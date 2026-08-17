# Content types

Canonical format contracts for Platform Signal. Length bands from the operating handbook; the Desk may sequence several types on the **same subject** over time (for example Signal → Operator Guide → Lab).

Assignment of type and persona is owned by The Desk. See [`../agents/MANAGING-EDITOR.md`](../agents/MANAGING-EDITOR.md) and [`ARTICLE-BRIEF.md`](./ARTICLE-BRIEF.md).

---

| Type | Frontmatter | Typical length | Primary persona | Research review |
|---|---|---|---|---|
| Deep Dive | `deep_dive` | 2,500–5,000 | Maya or Marcus | Mandatory |
| Operator Guide | `operator_guide` | 1,500–3,000 | Marcus | Mandatory |
| The Signal | `the_signal` | 600–1,500 | Elias | Strongly recommended |
| Field Note | `field_note` | 800–1,800 | Nia or Marcus | Strongly recommended |
| Platform Signal Lab | `lab` | 2,000–5,000+ | Marcus / Maya + Evidence Editor | Mandatory |
| Explainer | `explainer` | 1,200–2,500 | Maya (often) | Strongly recommended |
| Decision Guide | `decision_guide` | 1,500–3,000 | Nia or Maya | Strongly recommended |
| Roundtable | `roundtable` | as needed | Multiple | Strongly recommended |
| Reference Architecture | `reference_architecture` | article or visual-first | Maya | Mandatory |

---

## Deep Dive

Durable authoritative technical reference.

Required: architecture, sources, tradeoffs, recommendation.

## Operator Guide

Production implementation and operations.

Required: failure modes, observability, recovery/operations, version context.

## The Signal

Timely technical development.

Required sections: What happened? Why does it matter? What changed technically? Who should care? What are we watching next?

## Field Note

Practical observation or implementation lesson.

## Platform Signal Lab

Original experiment.

Required: hypothesis, environment, versions, method, evidence, results, limitations, reproduction instructions.

## Explainer

Establish vocabulary and conceptual understanding.

## Decision Guide

Help a reader choose.

Required: decision criteria, comparison, tradeoffs, recommendation by use case.

## Roundtable

Multiple personas answer one technical question. Purpose: show legitimate disagreement, present tradeoffs, build publication identity.

## Reference Architecture

Article-length or visual-first.

Required: components, data/control flow, assumptions, security, failure boundaries, version/date.

---

## Sequencing

A new capability might first be a short Elias Signal, later a Marcus Operator Guide, then a Lab. The Desk chooses the job for *this* piece, not a permanent type for the subject.
