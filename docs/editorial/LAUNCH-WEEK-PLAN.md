# Platform Signal — Launch week plan

**Status:** E25  
**Audience:** Founder / EiC  
**Site:** https://platformsignal.dev  
**Scope:** The **12 published** launch articles (Kubernetes cluster PS-000005–000007 stays deferred).

Goal: introduce the publication without dumping every URL in one day. Prefer cluster arcs over a flat list.

---

## Principles

- At most **one primary post per weekday** on LinkedIn; optional secondary channel the same day only if framing differs.
- Lead each cluster with the **pillar** (or the decision guide), then deepen.
- Reserve **HN** for at most 2–3 pieces in the whole sequence (operator / decision / deep dive), not every explainer.
- Capture good comments as opportunity cards (`editorial/opportunities/`).
- Soft-launch is fine while `noindex` remains; do not wait on Search Console to share direct links.

---

## Sequence (10 business days)

| Day | Focus | Article | Channel plan |
|---|---|---|---|
| **1** | Open the harness cluster | [What is an AI agent harness](https://platformsignal.dev/articles/what-is-an-ai-agent-harness) (PS-000001, Maya) | **LinkedIn:** definition + boundary takeaway. Short social optional. |
| **2** | Anatomy | [Anatomy of a production AI agent](https://platformsignal.dev/articles/the-anatomy-of-a-production-ai-agent) (PS-000002) | **LinkedIn:** one diagram callout (PS-D-0002). |
| **3** | Decision piece | [Harness vs framework vs MCP](https://platformsignal.dev/articles/agent-harness-vs-agent-framework-vs-mcp) (PS-000003) | **LinkedIn** + consider **HN** (decision table). |
| **4** | Deepen | [What belongs inside an agent harness](https://platformsignal.dev/articles/what-actually-belongs-inside-an-agent-harness) (PS-000004) | **LinkedIn:** ownership boundary, not a feature list. |
| **5** | MCP pillar | [MCP for platform engineers](https://platformsignal.dev/articles/mcp-for-platform-engineers) (PS-000008) | **LinkedIn:** blast radius / workload framing. |
| **6** | MCP operator | [MCP as privileged workloads](https://platformsignal.dev/articles/how-to-run-mcp-servers-as-privileged-workloads) (PS-000009, Marcus) | **LinkedIn** + strong **HN** candidate (operator specificity). |
| **7** | Platform SRE | [What is agentic platform engineering](https://platformsignal.dev/articles/what-is-agentic-platform-engineering) (PS-000010) | **LinkedIn:** assisted vs autonomous ownership. |
| **8** | Observability | [Observability for AI agents](https://platformsignal.dev/articles/observability-for-ai-agents) (PS-000011) | **LinkedIn:** chat logs ≠ traces. Optional Reddit (r/sre or similar) if framed as a failure-mode question. |
| **9** | FDE | [What is an FDE](https://platformsignal.dev/articles/what-is-a-forward-deployed-engineer) (PS-000012) → [FDE vs PE vs SA](https://platformsignal.dev/articles/fde-vs-platform-engineer-vs-solutions-architect) (PS-000013) | **LinkedIn:** one post spanning both (problem → ownership table). Careers Reddit only if useful, not promotional. |
| **10** | The Signal close | [MCP gateway Signal](https://platformsignal.dev/articles/why-everyone-suddenly-wants-an-mcp-gateway) (PS-000014) + [Platform engineering + AI agents](https://platformsignal.dev/articles/the-state-of-platform-engineering-in-the-age-of-ai-agents) (PS-000015) | **LinkedIn:** one timely takeaway each on consecutive half-days or Day 10 + Day 11 if needed. **Not HN** by default. |

Skip days for weekends or when quality of the post is not ready. Stretching to ~2 calendar weeks is better than rushing.

---

## Founder LinkedIn checklist (every post)

- [ ] One takeaway a practitioner can repeat
- [ ] One diagram, table, or concrete rule mentioned
- [ ] No persona-as-person claim
- [ ] Link to `platformsignal.dev` article URL
- [ ] Claim scope matches the article (especially survey-based Signal pieces)

---

## Reader questions → Radar

When a comment asks something durable:

1. Summarize the question in one sentence
2. Add or update `editorial/opportunities/PS-O-….yml` (or note for next Radar Monday)
3. Do not promise a follow-up article in-thread unless the Desk has approved a brief

---

## Explicitly out of this plan

- Kubernetes launch cluster (PS-000005–000007)
- Newsletter Issue 0 (E23 deferred)
- Turning off `noindex` / Search Console submit (separate public-launch decision)

---

## Related

- [`../agents/DISTRIBUTION-EDITOR.md`](../agents/DISTRIBUTION-EDITOR.md)
