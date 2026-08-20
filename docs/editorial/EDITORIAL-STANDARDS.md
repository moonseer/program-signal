# Platform Signal — Editorial Standards

**Status:** Publication constitution  
**Canonical companions:** [`../PLATFORM-SIGNAL-25-AREA-OPERATING-HANDBOOK.md`](../PLATFORM-SIGNAL-25-AREA-OPERATING-HANDBOOK.md) §1, [`../PLATFORM-SIGNAL-AUTHOR-PERSONAS.md`](../PLATFORM-SIGNAL-AUTHOR-PERSONAS.md), [`../PLATFORM-SIGNAL-TECHNICAL-RESEARCH-EDITOR.md`](../PLATFORM-SIGNAL-TECHNICAL-RESEARCH-EDITOR.md), [`HUMAN-APPROVAL-GATE.md`](./HUMAN-APPROVAL-GATE.md)

Personas may differ in voice. They may not differ in evidence rules.

Operating principle:

> High signal. Low noise. Evidence always.

Public summary: [`/editorial-standards`](/editorial-standards)

---

## 1. Mission

Platform Signal is an evidence-led technical publication on production AI, Kubernetes, platform engineering, SRE, observability, agent infrastructure, and forward deployed engineering.

It exists to help practicing engineers decide what to pay attention to, how to design it, how to operate it, and whether to apply it.

It is not a commodity blog, a vendor channel, or an SEO mill. Search demand may influence discoverability. It does not define editorial importance.

---

## 2. Accuracy

Operational rules, not aspirations:

- Material technical claims require evidence.
- Version-specific claims must name the relevant versions and, when it matters, maturity (alpha / beta / GA).
- Benchmarks must disclose methodology, environment, and limitations.
- Predictions must be labeled as predictions.
- Opinion and analysis must not be written as fact.
- Hypothetical examples must be labeled as hypothetical.
- If evidence is unavailable, say so. Do not fill the gap with plausibility.

Claim statuses used by the Evidence Editor: `VERIFIED` · `SUPPORTED` · `CONTESTED` · `UNSUPPORTED` · `INCORRECT`.

Statement classes: `FACT` · `ANALYSIS` · `INFERENCE` · `OPINION` · `PREDICTION`.

---

## 3. Primary sources

Prefer, in order:

1. Specifications
2. Official documentation
3. Standards
4. Research papers
5. Maintainer documentation

before secondary commentary.

Never cite a secondary source when a reasonable primary source is available for the same technical claim.

Source tiers:

| Tier | Meaning |
|---|---|
| 1 | Specs, official docs, standards, original research |
| 2 | Vendor engineering / maintainer docs |
| 3 | Reputable technical journalism and demonstrated practitioner analysis |
| 4 | Community discussion — useful as a pain signal, rarely as sole factual evidence |

SEO aggregators and unsourced explainers are not primary evidence.

---

## 4. AI transparency

Disclose, on the site and in process:

- Editorial personas are not represented as real-world people.
- AI may assist research, drafting, summarization, editing, diagrams, and metadata.
- Technical claims are reviewed through an evidence process.
- A human editor retains publication accountability.

Do not invent employers, degrees, awards, or “years at Google.” See [`AI-EDITORIAL-PROCESS.md`](./AI-EDITORIAL-PROCESS.md).

---

## 5. Independence

Editorial conclusions cannot be purchased.

Allowed with disclosure: briefings, demos, time-limited licenses, documentation access, interviews.

Not allowed: paying for a conclusion, undisclosed affiliate steering, vendor-written “independent” analysis.

Detail: [`SPONSORSHIP-POLICY.md`](./SPONSORSHIP-POLICY.md), [`VENDOR-INTERACTION-POLICY.md`](./VENDOR-INTERACTION-POLICY.md), [`MONETIZATION-PRINCIPLES.md`](./MONETIZATION-PRINCIPLES.md).

---

## 6. Corrections

Technical publishing will be wrong sometimes. Credibility comes from handling errors visibly.

| Severity | Examples | Public notice |
|---|---|---|
| Minor | Typo, grammar, formatting | No |
| Clarification | Meaning unchanged; wording improved | Optional revision note |
| Material | Wrong version, incorrect command, misstated behavior | Required visible notice |
| Retraction | Core conclusions unreliable | Required; rare |

Material errors are corrected transparently rather than silently. Corrections are recorded in article frontmatter.

Detail: [`CORRECTIONS-POLICY.md`](./CORRECTIONS-POLICY.md). Public log: [`/corrections`](/corrections).

---

## 7. Conflicts of interest

Disclose sponsorship, affiliate relationships, free products or services, vendor access, and consulting relationships where relevant.

Frontmatter `sponsorship.sponsored` and `sponsorship.affiliateLinks` must be accurate. Sponsored content without disclosure fields fails CI.

---

## 8. Human publication approval

Neither The Radar, The Desk, an author persona, nor the Evidence Editor may publish.

Four-part gate before production content merges:

1. Evidence Editor `PASS`, or `PASS WITH CHANGES` after required changes are completed
2. Desk `READY FOR HUMAN APPROVAL`
3. Automated checks `PASS` (`validate:content`, lint, types, build)
4. Human Editor-in-Chief `APPROVED`

CI green is not publication approval. Details: [`HUMAN-APPROVAL-GATE.md`](./HUMAN-APPROVAL-GATE.md).

---

## 9. Shared article standard

Every voice still:

1. Respects the reader’s time
2. Explains why the topic matters
3. Avoids hype
4. Provides technical depth appropriate to the type
5. Uses visual explanation where it earns its keep
6. Discusses tradeoffs
7. Explains production implications
8. Cites authoritative sources
9. Reaches a clear conclusion
10. Prefers useful insight over volume
