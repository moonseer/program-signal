# Platform Signal — AI and Editorial Process

**Public copy:** [`/ai-and-editorial-process`](/ai-and-editorial-process)  
**Constitution:** [`EDITORIAL-STANDARDS.md`](./EDITORIAL-STANDARDS.md)

---

## What AI may do

AI-assisted tools may:

- Research and summarize primary sources
- Draft and revise prose in an assigned persona voice
- Propose structure, headings, and metadata
- Generate diagram *source* (for example Mermaid) for a human or pipeline to render
- Suggest internal links, titles, and briefs
- Help score opportunities and editorial fit *as input*, not as a publish decision

AI output is a draft. It is not a published article.

---

## What AI may not do

AI may not:

- Publish, merge to `main`, or treat CI green as approval
- Invent sources, quotations, benchmarks, or experience
- Fabricate employers, degrees, certifications, awards, or “years at …”
- Override Evidence Editor findings
- Present personas as real-world individuals
- Equate search volume or hype with production maturity
- Fill missing evidence with plausible language

---

## How personas are disclosed

Platform Signal uses named editorial personas to represent distinct questions and writing styles. They are not presented as real-world individuals.

Recommended site-wide language:

> Platform Signal uses named editorial personas to represent distinct areas of technical analysis and writing style. These personas are not presented as real-world individuals. Research and drafting may use AI-assisted tools; technical claims, recommendations, and sources are reviewed through the Platform Signal editorial process.

Recommended article attribution:

> Written in the [Persona] editorial voice  
> Reviewed by Platform Signal Editorial

Use the real human name (founder/editor) for personal experience, labs the founder ran, editorial positions, and first-person operational stories.

---

## How Research Editor review works

The Technical Research Editor (Evidence Editor) answers: **can we prove the claims?**

It is independent of The Radar (what deserves attention) and The Desk (what deserves publication, in which form and voice).

Review outcomes: `PASS` · `PASS WITH CHANGES` · `HOLD` · `FAIL`.

Mandatory for Deep Dive, Operator Guide, Lab, and Reference Architecture. Strongly recommended for Signal, Field Note, Explainer, Decision Guide, and Roundtable.

The Desk does not override evidence findings. Spec: [`../agents/TECHNICAL-RESEARCH-EDITOR.md`](../agents/TECHNICAL-RESEARCH-EDITOR.md).

---

## Control-layer split

| Question | Owner | May publish? |
|---|---|---|
| What deserves attention? | The Radar | No |
| What deserves publication, in this form, in this voice? | The Desk | No |
| Can we prove the claims? | Evidence Editor | No |
| Ship it? | Human Editor-in-Chief | Yes, after the four-part gate |
