# Platform Signal — Product Backlog

**Version:** 1.0  
**Date:** August 17, 2026  
**Status:** See [Now / Next](#now--next). Agent-harness cluster drafted; human Editor-in-Chief approval is still open. Site remains `noindex`.  
**Source of truth for work:** this document  
**Source of truth for product intent:** the docs in `/docs`  
**Canonical control-layer agents:** [`PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](./PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md) (The Desk + The Radar)  
**Canonical agent implementation:** [`PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md`](./PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md) (Author Engine, persona packages, workflow, model routing)

---

## How to use this backlog

Work is organized as **Phases → Epics → Stories → Tasks**.

| ID prefix | Meaning |
|---|---|
| `P0`–`P5` | Delivery phase |
| `E##` | Epic |
| `S##.##` | Story inside an epic |
| Tasks | Checkboxes under a story |

**Status values:** `Not started` · `In progress` · `Done` · `Blocked` · `Deferred`

**Priority:** `P0` must exist before writing launch articles at scale. Later phases can start only when the previous phase’s exit criteria are met, unless a story is explicitly marked *can start in parallel*.

When a story is completed, check its tasks and change the story status. Do not skip Phase 0 editorial gates just because the site scaffold is ready.

---

## Now / Next

**Updated:** 17 August 2026  
**Phase:** Agent-harness cluster (**published** on `main`). MCP cluster `PS-000008`–`PS-000009` **published**. Build-time search **landed**. Site remains `noindex`. **Kubernetes is not in scope** for runtime or the next content cluster.

Keep this section current. Detail lives in the epics below.

### Done

| Area | What landed |
|---|---|
| Constitution | Editorial standards, AI process, human approval gate, persona disclosure |
| Agents | Radar, Desk, and Evidence Editor specs in-repo. Implementation architecture defined (Author Engine + persona packages, LangGraph workflow). None can publish. |
| Engine | Next.js site, CI validate-then-deploy, Vercel Hobby, `main` requires a PR + passing `validate` |
| Schemas | Articles, opportunities, briefs, evidence ledger, public references, ID registry |
| License | MIT for site software; editorial content all rights reserved |
| Launch planning | 15 opportunity cards + 15 Desk briefs (`PS-000001`–`PS-000015`) |
| Agent-harness cluster | `PS-000001`–`PS-000004` published ([#5](https://github.com/moonseer/program-signal/pull/5)) |
| Agent runtime Phase 1 | LangGraph workflow, persona packages, PydanticAI agents (Desk/Author/Evidence), capability routing, dry-run + test-model + live modes, revision cap, Evidence gates ([#7](https://github.com/moonseer/program-signal/pull/7)–[#11](https://github.com/moonseer/program-signal/pull/11)) |
| MCP cluster start | `PS-000008` published with evidence and diagram `PS-D-0004` ([#7](https://github.com/moonseer/program-signal/pull/7)) |
| MCP operator guide | `PS-000009` reframed as a host-agnostic privileged-workload guide with diagram `PS-D-0005`; Kubernetes is not the default host |
| Homepage + topics | Magazine homepage, topic cluster pages, list-first articles index with filters |
| Build-time search | FlexSearch dialog in the header (⌘K); no search API |

### Do next (recommended order)

1. **Platform engineering / SRE cluster** — `PS-000010` (What Is Agentic Platform Engineering?) then `PS-000011`. Kubernetes cluster (`PS-000005`–`000007`) stays deferred.

### Deferred (not now)

- **Kubernetes + AI launch cluster** (`PS-000005`–`PS-000007`, E14) — briefs stay in-repo; articles wait until Kubernetes is back in editorial scope.

### Not next

- Illustrated persona portraits, topic accent colors, or long-article comfort testing
- RSS, newsletter vendor, custom domain
- Public launch / turning off `noindex`
- Running Radar or Desk as live jobs **before Agent runtime Phase 1 is proven**
- Kubernetes launch cluster (`PS-000005`–`000007`)
- Monetization (Hobby is non-commercial)

### How to see progress in this file

| Phase | Epics | How it looks right now |
|---|---|---|
| P0 Foundation | E01–E05 | E01–E03 **Done**. E04–E05 leftovers are optional design and CODEOWNERS. |
| P1 Publishing system | E06–E12 | E06 **In progress**. E11 search **Done**. E07, E08, E09, E10 **In progress**. |
| P2 Launch inventory | E13–E21 | E13 **Done**. E15 S15.01–S15.02 **Done** pending human merge. E14 **deferred** (Kubernetes not in scope). |
| P-ind. Agent enablement | E37–E39 | E37/E39 **In progress** (Phase 1 scaffold landed). |
| P3–P5 | E22–E38 | Not started, except deferred items. |

---

## 1. What we are building

Platform Signal is an **AI-assisted technical newsroom**, not a conventional blog.

It publishes evidence-led writing about:

- Kubernetes and AI infrastructure
- Platform engineering, SRE, and DevOps
- AI agents, agent harnesses, and MCP
- Observability
- Forward deployed engineering

The product is the combination of:

1. **Four named editorial personas** (Marcus, Maya, Elias, Nia) with distinct questions and voices
2. **The Radar** (Topic Research / Opportunity / Content Intelligence Agent) — decides what is worth investigating
3. **The Desk** (Editorial Agent / Managing Editor) — decides what to publish, in which format, in which voice
4. **The Evidence Editor** (Technical Research Editor) — independently verifies claims
5. **Git-native articles** (MDX + YAML), not a proprietary CMS
6. **A magazine-quality reading experience** (scan → understand → explore → go deep)
7. **Original Labs** with reproducibility, not just narrative
8. **The Signal**, a weekly briefing that is a product, not a link dump
9. **A human Editor-in-Chief gate** — agents discover, frame, draft, and check; a human publishes

Discovery does not equal approval. Search demand does not equal editorial importance. Neither control-layer agent writes the final article by default, replaces the Research Editor, or publishes.

Operating principle:

> High signal. Low noise. Evidence always.

North-star metric (do not use raw pageviews):

> **Monthly Engaged Technical Readers** — a unique reader who engages >2 minutes, reads multiple articles, copies code, opens a diagram, subscribes, or returns within 30 days.

---

## 2. Hosting and delivery constraints

Code lives on **GitHub**. The public site is hosted on **Vercel Hobby**.

Hobby is viable for launch if the architecture stays **mostly static**. It is not viable as a general-purpose app platform or as a commercial business host.

### 2.1 Architecture that fits Hobby

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | First-class Vercel support, MDX, SSG |
| Rendering | Static generation at build time | Avoids function CPU/memory; articles are Git content |
| CMS | Git / MDX / YAML in this repo | Handbook requires Git as canonical content; no vendor lock-in |
| Styling | Tailwind CSS + a small custom design system | Matches the editorial-tech aesthetic without a heavy UI kit |
| Diagrams | Mermaid source → SVG at build or in CI | Static assets; no runtime diagram service |
| Search (launch) | Build-time index (Pagefind or FlexSearch) | No Algolia bill, no search API functions |
| Newsletter | External provider (Buttondown, Beehiiv, or equivalent) | Do not send email from Vercel functions |
| Analytics | Search Console + GA4 + Vercel Web Analytics | Free / included; stay under 50k Vercel Analytics events initially |
| CI/CD | GitHub Actions validate, then Vercel CLI deploy | Sequential gate; Vercel Git auto-deploy is off. See `docs/CI-CD.md` |
| Database | None on the public site | Frontmatter + YAML graphs generated at build |
| Agent runtime state | PostgreSQL (editorial-runtime; local Docker) | Workflow stages, briefs, drafts, evidence — **not** on Vercel Hobby |
| Auth | None on the public site | Preview protection via Vercel if needed |

### 2.2 Hobby limits that shape the backlog

Current Vercel Hobby constraints this backlog respects:

| Resource | Hobby | Implication for Platform Signal |
|---|---|---|
| Commercial use | Personal / non-commercial only | Launch as a personal publication. **Monetization requires Pro.** |
| Fast Data Transfer | 100 GB / month | Static pages, compressed assets, SVG diagrams, few large images |
| Edge requests | 1,000,000 / month | Fine for early traffic; watch bots |
| Function invocations | 1,000,000 | Prefer zero functions on article pages |
| Function CPU / memory | 4 CPU-hrs / 360 GB-hrs | No SSR for every article view; no AI inference on Vercel |
| Function duration | 300s max | Do not run research agents or lab jobs on Vercel |
| Image transformations | 5,000 / month | Prefer static SVG/PNG; do not run every image through `next/image` optimization at scale |
| Web Analytics events | 50,000 / month | Use GA4 for deeper events; keep Vercel Analytics light |
| Cron | Daily minimum interval | Freshness/editorial jobs: GitHub Actions, not Vercel cron, until needed |
| Concurrent builds | 1 | Avoid noisy preview deploys; protect `main` |
| Build time | 45 minutes | Keep MDX/Mermaid pipeline efficient |
| Custom domain | Allowed | Use it |
| Team collaboration | No | Single-owner Hobby account is fine |

### 2.3 Explicitly out of scope on Hobby

Do **not** put these on Vercel Hobby:

- LLM research/drafting agents as production serverless functions
- Neo4j or any always-on graph database
- “Ask Platform Signal” / RAG chat as a launch feature
- Kubernetes dry-run validation inside Vercel
- Newsletter blast sending
- Heavy ISR/on-demand regeneration for every article
- A headless CMS as the canonical store

Agents, labs, and code verification run **locally, in GitHub Actions, or on a separate Python runtime** (LangGraph + PydanticAI + LiteLLM + PostgreSQL per the agent architecture doc). Vercel only serves the built site. **Platform Signal is not running on Kubernetes.**

### 2.4 When to leave Hobby

Upgrade to **Vercel Pro** before:

- Any sponsorship, affiliate, paid newsletter, or other commercial use
- Traffic that approaches 100 GB transfer or 1M edge requests
- Password-protected previews for collaborators
- Team members on the Vercel project
- On-demand revalidation / ISR-heavy workflows
- Semantic search or Ask Platform Signal APIs

---

## 3. Phase map

```text
P0  Foundation              Editorial constitution + repo + design tokens
P1  Publishing system       Site chrome, article engine, evidence UX, CI
P2  Launch inventory        12–15 clustered articles + public trust pages
P3  Public launch           Domain, SEO, analytics, newsletter, distribute
P4  First 90 days           Cadence, Signal, first Lab, measure, refresh
P5  Authority               Clusters, knowledge graph, distribution, later products
```

Cadence targets from the content strategy (quality over volume):

| Period | Target |
|---|---|
| Day 1 | 12–15 articles |
| Weekly | 2 articles + 1 Signal briefing |
| Monthly | ~8 substantial articles including 1 Lab |
| Day 90 | ~40 articles |
| Month 6 | ~60–70 articles |
| Month 12 | 80–100 articles, 12 Labs, 6 mature clusters |

Recommended monthly mix after launch: 2 architecture deep dives, 2 operator guides, 2 Signal/emerging pieces, 1 field/FDE article, 1 Lab.

---

## 4. Recommended first build order

When we start coding, do this sequence — not all of P1 at once:

1. Next.js app, Tailwind, design tokens, light/dark
2. Content schema + one fixture article (the Agent Harness piece)
3. Article page anatomy (header, TOC, callouts, code, recommendation, sources)
4. Homepage magazine layout
5. Topics, Labs, authors, About, policy pages
6. Search, RSS, sitemap, newsletter CTA
7. GitHub Actions validate-then-deploy to Vercel (`docs/CI-CD.md`)
8. Launch clusters one at a time (agent-harness first; **not** Kubernetes until in scope)
9. **Editorial agent runtime Phase 1** (after the first cluster proves the human gate): Author Engine + persona packages → Desk → Evidence → LangGraph workflow → human approval — see E37 and the agent architecture doc §26
10. Radar automation, eval suite, and distribution agent **after** Phase 1 workflow is trustworthy

---

# PHASE 0 — Foundation

**Goal:** The publication can make editorial decisions and the repo can receive content, before generating the first 15 articles at scale.

**Exit criteria:**

- Editorial constitution exists and is linked from the future site
- Article brief, content types, metadata schema, evidence ledger, and opportunity-card schemas are defined
- The Desk (Editorial Agent) and The Radar (Topic Opportunity Agent) are in-repo agent specs, sourced from `PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`
- Research Editor role is documented as an independent evidence spec
- Human approval gate is written down; no agent can publish
- Next.js repo boots locally
- GitHub remote is the canonical repo
- Design tokens exist so UI work is not invented ad hoc

---

## E01 — Editorial constitution

**Status:** Done  
**Phase:** P0  
**Priority:** Critical

The publication needs one non-negotiable standard for truth, disclosure, sourcing, independence, and accountability. Personas may differ in voice; they may not differ in evidence rules.

### S01.01 — Editorial standards document

Write `docs/editorial/EDITORIAL-STANDARDS.md` as the publication constitution.

- [x] Mission statement
- [x] Accuracy rules (versioned claims, benchmarks, predictions vs facts)
- [x] Primary-source preference
- [x] AI transparency (personas are not real people; AI may assist; human remains accountable)
- [x] Independence (conclusions cannot be purchased)
- [x] Corrections principle
- [x] Conflicts of interest
- [x] Human publication approval
- [x] Public summary suitable for `/editorial-standards`

### S01.02 — AI and editorial process page copy

Write `docs/editorial/AI-EDITORIAL-PROCESS.md`.

- [x] What AI may do (research, draft, summarize, edit, diagrams, metadata)
- [x] What AI may not do (autonomous publish, invent sources, fake experience)
- [x] How personas are disclosed
- [x] How Research Editor review works
- [x] Public copy for `/ai-and-editorial-process`

### S01.03 — Persona disclosure language

- [x] Site-wide disclosure text from the author-personas doc
- [x] Article byline pattern: “Written in the [Persona] editorial voice / Reviewed by Platform Signal Editorial”
- [x] Rule: real human name for personal experience, labs the founder ran, editorial positions

---

## E02 — Editorial operating roles

**Status:** Done  
**Phase:** P0  
**Priority:** Critical

Canonical spec: [`PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](./PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md).

Keep three questions in three different roles:

| Question | Owner | Internal name |
|---|---|---|
| What deserves attention? | Topic Research / Opportunity Agent | **The Radar** |
| What deserves publication, in this form, in this voice? | Editorial Agent / Managing Editor | **The Desk** |
| Can we prove the claims? | Technical Research Editor | **Evidence Editor** |

The two control-layer agents must remain separate so discovery never equals approval.

### S02.01 — Editorial Agent (The Desk) spec

Write `docs/agents/MANAGING-EDITOR.md` from the agent doc (do not invent a thinner version).

- [x] Formal name: Platform Signal Managing Editor; functional name: Editorial Agent
- [x] Mission: portfolio quality, story selection, voice/format assignment, standards — not technical truth
- [x] Nine ownership areas: portfolio mix, story selection, editorial-fit scoring, persona assignment (incl. secondary perspective), content-type selection, article briefs, anti-word-salad / readability / visual review, duplicate detection, final editorial review
- [x] Editorial-fit score (100): reader value 20, Platform Signal fit 20, originality 15, technical depth 15, timeliness 10, evergreen 10, evidence 5, internal-link 5
- [x] Decision statuses: APPROVE / APPROVE WITH REFRAMING / HOLD / MERGE / REJECT / WATCH
- [x] Persona assignment tree: architecture → Maya, operate → Marcus, why now → Elias, apply → Nia
- [x] Same subject may sequence Signal → Operator Guide → Lab over time
- [x] Hard guardrails: never invent facts/experience/citations, never override Research Editor, never chase keywords alone, never publish, never collapse personas, never hide uncertainty
- [x] Weekly Monday **Editorial Desk** report
- [x] Desk KPIs (rejection rate is not the goal; decision quality is)
- [x] Desk persistent state: inventory, calendar, persona workload, topic/type mix, research-review status, corrections, reader questions, quality scores

### S02.06 — Topic Research / Opportunity Agent (The Radar) spec

Write `docs/agents/CONTENT-INTELLIGENCE.md` from the same agent doc.

- [x] Formal name: Platform Signal Content Intelligence Agent; functional name: Topic Research / Opportunity Agent
- [x] Mission: identify, research, score, prioritize — does **not** decide publication
- [x] Four signal categories: technology, research, search demand, practitioner (pain ≠ evidence)
- [x] Classifications: BREAKING / EMERGING / EVERGREEN / PAIN POINT / COMPARISON / CONCEPT / LAB OPPORTUNITY
- [x] Opportunity score (100): audience pain 20, fit 15, momentum 15, originality gap 15, search 10, authority 10, evergreen 5, evidence 5, lab potential 5 — **this supersedes the handbook’s older topic-score weights**
- [x] Opportunity card output (`PS-O-NNNN`), not unprioritized dumps
- [x] Lifecycle: DISCOVERED → QUALIFYING → WATCHING|REJECTED → OPPORTUNITY → EDITORIAL REVIEW → APPROVED|HOLD → BRIEF → ARTICLE → PUBLISHED → PERFORMANCE REVIEW
- [x] SEO influences discoverability, not what we believe is important
- [x] Commodity / novelty check; horizons NOW / NEXT / FOUNDATIONAL
- [x] Cluster detection and lab-opportunity detection
- [x] Weekly Monday **Opportunity Radar** (top 5, watch list, declining, refresh)
- [x] Radar KPIs and outcome learning (prediction vs 60-day result)
- [x] Prompt principles: never invent search volume or trend data; never equate hype with production maturity

### S02.07 — Agent-to-agent contract

- [x] Topic Agent emits opportunity YAML (fields in agent doc §38)
- [x] Editorial Agent returns editorial_decision YAML (reason, angle, type, persona, secondary reviewer, thesis, sections, evidence, visuals, length, research_review_level, priority, publish_window)
- [x] The agents are expected to **disagree**: Radar may score search high; Desk may reject on fit. Fit wins.
- [x] Neither Topic Agent, Desk, author, nor Research Editor can publish

### S02.08 — Personas vs agents (implementation model)

Canonical: [`PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md`](./PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md).

- [x] Personas (Marcus, Maya, Elias, Nia) are **versioned writing configurations**, not four separate autonomous agent runtimes
- [x] One shared **Author Engine** assembles context from base author instructions + editorial standards + persona package + content type + brief + approved evidence
- [x] Model routing by **capability class** (research, reasoning, writer, fast, local) — not `marcus-model` / `maya-model`
- [x] Structured typed outputs for Radar, Desk, and Evidence; prose generation only in the Author role
- [ ] Persona package files in-repo (`persona.md`, `voice.md`, `patterns.md`, `examples.md`, `anti-patterns.md`, `review-rubric.md`) — see E39

### S02.02 — Technical Research Editor spec in-repo

Promote the existing research-editor doc into the agent path.

- [x] Copy/adapt `docs/PLATFORM-SIGNAL-TECHNICAL-RESEARCH-EDITOR.md` → `docs/agents/TECHNICAL-RESEARCH-EDITOR.md`
- [x] Claim status model: VERIFIED / SUPPORTED / CONTESTED / UNSUPPORTED / INCORRECT
- [x] Statement classes: FACT / ANALYSIS / INFERENCE / OPINION / PREDICTION
- [x] Review outcomes: PASS / PASS WITH CHANGES / HOLD / FAIL
- [x] Mandatory vs strongly-recommended review by content type
- [x] Behavioral rules and non-goals
- [x] Explicit: The Desk does not override evidence findings

### S02.03 — Human approval gate

- [x] Four-part gate: Research Editor PASS (or PASS WITH CHANGES completed) + Desk READY FOR HUMAN APPROVAL + automated checks PASS + Human Editor-in-Chief APPROVED
- [x] No merge to production content without the human checkbox
- [x] PR template that captures opportunity id, editorial_decision, research status, human approval

### S02.04 — Article brief template

Write `docs/standards/ARTICLE-BRIEF.md`, `editorial/briefs/` schema, and `content/_templates/brief.yml`.

Canonical brief lives in `editorial/briefs/PS-NNNNNN.yml` (Desk output). Copy into the article folder when drafting starts.

- [x] Fields from the agent doc brief (article_id, working_title, content_type, author_persona, secondary_perspective, target_reader, primary_question, reader_problem, central_thesis, why_now, unique_angle, required_sections, claims_to_verify, required_visuals, target_length, research_review)
- [x] Keep handbook extras that still help: keywords, competing content, production/security questions, internal_links, refresh_cycle, target_publish_date
- [x] No drafting until audience, thesis, unique value, evidence, cluster, persona, and type are set
- [x] Keyword-first and thesis-free briefs are explicit failure modes

### S02.05 — Content types

Write `docs/standards/CONTENT-TYPES.md`.

- [x] Deep Dive
- [x] Operator Guide
- [x] The Signal
- [x] Field Note
- [x] Platform Signal Lab
- [x] Explainer
- [x] Decision Guide
- [x] Roundtable
- [x] Reference Architecture
- [x] Required sections and primary persona for each type
- [x] Length bands
- [x] Note that The Desk may sequence multiple types on the same subject over time

---

## E03 — Content schemas and repository layout

**Status:** Done  
**Phase:** P0  
**Priority:** Critical

### S03.01 — Repository structure

Create the canonical tree (empty templates first, not 15 articles):

```text
platform-signal/
├── docs/
│   ├── editorial/
│   ├── agents/
│   └── standards/
├── editorial/
│   ├── opportunities/          # Radar cards  PS-O-NNNN.yml
│   ├── briefs/                 # Desk briefs  PS-NNNNNN.yml
│   ├── calendar.yml            # Desk state
│   ├── clusters.yml
│   ├── watchlist.yml
│   ├── sources.yml
│   └── performance/
├── content/
│   ├── articles/
│   ├── authors/
│   └── pages/
└── src/   (or app/)
```

- [x] Folders and README pointers
- [x] `.gitignore` for Node, env, OS files
- [x] License decision (site code vs article copyright)

### S03.02 — Article metadata schema

Implement the handbook schema as a Zod (or equivalent) validator.

- [x] Immutable `id` (`PS-000001` sequential, no topic semantics)
- [x] slug, title, description, contentType, authorPersona
- [x] dates: publishedAt, updatedAt, lastReviewedAt, reviewAfter
- [x] status: CURRENT / REVIEW DUE / STALE / ARCHIVED plus editorial workflow statuses (draft / review / approved)
- [x] technologyVersions, difficulty, readingTime
- [x] SEO block
- [x] research, codeVerification, reproducibility, corrections, relationships, sponsorship
- [x] concepts / relatedTechnologies / dependsOn for later graph generation
- [x] Reject unknown required fields in CI

### S03.03 — Evidence ledger schema

- [x] `evidence.yml` per article
- [x] Claim id, text, type, status, confidence, sources (title, org, url, date, tier)
- [x] Ledger is **internal** — not dumped onto the public page
- [x] Public references are a curated subset

### S03.04 — Source library schema

- [x] `editorial/sources.yml` with source_id, title, org, url, type, tier, topics, dates, license, doi, notes
- [x] Tiers 1–4 as defined by the Research Editor
- [x] Taxonomy folders conceptually: Kubernetes, platform engineering, AI agents, observability, AI infrastructure, security, research

### S03.05 — Topic opportunity schema

Canonical scoring and lifecycle: agent doc §§25–28. Do not implement the older handbook topic-score weights.

- [x] One YAML file per card: `editorial/opportunities/PS-O-NNNN.yml`
- [x] Zod schema matching the Topic Agent output contract (§38)
- [x] Lifecycle states: DISCOVERED, QUALIFYING, WATCHING, REJECTED, OPPORTUNITY, EDITORIAL REVIEW, APPROVED, HOLD, BRIEF, ARTICLE, PUBLISHED, PERFORMANCE REVIEW
- [x] Classification enum + commodity_risk (LOW/MEDIUM/HIGH) + horizon (NOW/NEXT/FOUNDATIONAL)
- [x] `docs/standards/TOPIC-SCORING-RUBRIC.md` documents **both** the Radar opportunity score and the Desk editorial-fit score
- [x] Seed the 15 launch titles as opportunity cards in APPROVED / BRIEF
- [x] `editorial/clusters.yml` and `editorial/watchlist.yml`

### S03.06 — Permanent IDs

- [x] Article IDs: `PS-000001`
- [x] Opportunity IDs: `PS-O-0001`
- [x] Diagram IDs: `PS-D-0001`
- [x] Claim IDs: `C001` per article
- [x] Source IDs: `SRC-…`
- [x] Lab IDs: `LAB-0001`
- [x] ID registry file or generator script so IDs never collide
- [x] Slugs may change; IDs never do; redirects later

---

## E04 — Design foundation

**Status:** In progress  
**Phase:** P0  
**Priority:** High  
**Can start in parallel with E01–E03**

### S04.01 — Design tokens

- [x] Light theme: warm off-white background, charcoal type, one accent
- [x] Dark theme: not pure black; tuned borders and code surfaces
- [ ] Topic accent colors (optional, restrained)
- [x] Type scale: editorial display headings, long-form body, selective monospace
- [x] Spacing, rules, radii (prefer thin rules over cards)
- [x] Motion: short, optional, respects `prefers-reduced-motion`

### S04.02 — Typography pairing

- [x] Choose heading + body + mono fonts (readable, distinctive, self-host or `next/font`)
- [x] Test code-adjacent body text
- [ ] Test 2,500–5,000 word comfort

### S04.03 — Component inventory (design, not all coded yet)

Spec the design-guide components before inventing new ones:

Header, footer, nav, topic menu, search dialog, feature story, Signal item, topic section, article list, article card (sparingly), lab card, newsletter CTA, article header, At a Glance, TOC, reading progress, callouts (SIGNAL / PRODUCTION NOTE / WATCH OUT / FIELD NOTE), code block, figure, diagram, comparison table, recommendation block, source list, related articles, difficulty indicator, series nav, breadcrumb.

- [x] Written component checklist in `docs/standards/` or a design README
- [x] Explicit non-goals: card grids, tag clouds, stock AI art, glassmorphism, robot imagery

### S04.04 — Persona visual system

- [x] Motifs: Marcus terminal/heartbeat, Maya grid/blueprint, Elias radar/pulse, Nia path/nodes
- [ ] Illustrated editorial portraits — not fake photorealistic headshots
- [x] Same article template for all authors; identity is subtle

---

## E05 — Engineering bootstrap

**Status:** In progress  
**Phase:** P0  
**Priority:** Critical  
**Can start in parallel with E01–E04**

### S05.01 — Next.js application skeleton

- [x] Create Next.js + TypeScript app in this repo (App Router)
- [x] ESLint and `strict` TypeScript (Prettier later)
- [x] Tailwind + design tokens from E04
- [x] Light/dark with system preference + manual toggle
- [x] Semantic HTML layout shell
- [x] `README.md` with local run instructions

### S05.02 — GitHub repository hygiene

- [x] Confirm GitHub remote and default branch (`main`)
- [x] Ruleset on `main`: PR required + passing `validate` job (once `ci.yml` exists)
- [ ] CODEOWNERS optional (single owner is fine)
- [x] Issue templates later; PR template now (see S02.03)
- [x] Do not commit `.env`, secrets, or newsletter provider API keys

### S05.03 — Vercel Hobby project

Follow `docs/CI-CD.md`. Do **not** use Vercel’s default “deploy on every git push.”

- [x] Create Vercel Hobby project and `vercel link`
- [x] `vercel.json`: `git.deploymentEnabled: false`
- [x] GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- [x] Production URL is the Vercel project URL until the custom domain (P3)
- [x] Environment: none required for a static site at this stage
- [x] Confirm build stays well under 45 minutes
- [x] Document Hobby commercial-use limit in README

### S05.05 — Validate-then-deploy pipeline

- [x] `.github/workflows/ci.yml`: `validate` job, then `deploy` job (`needs: validate`)
- [x] PR / non-`main` push → Vercel **preview** only if validate passes
- [x] Push to `main` → Vercel **production** only if validate passes
- [x] Failed validate leaves the last good Vercel deploy unchanged
- [x] Preview URL commented on the PR
- [x] Prove the gate with a deliberate failing PR before relying on it ([#1](https://github.com/moonseer/program-signal/pull/1))

### S05.04 — Local content pipeline spike

Prove one article can render before building the whole magazine.

- [x] Choose MDX loader (prefer a compile-time collection: Contentlayer, content-collections, or velite — pick one and stay)
- [x] Render `content/articles/what-is-an-ai-agent-harness/index.mdx` as a fixture
- [x] Frontmatter validated against Zod schema
- [x] Reading time computed at build
- [x] 680–760px measure for prose

---

# PHASE 1 — Publishing system

**Goal:** The site can present a real Platform Signal article with the intended reading experience, evidence UX, and automation gates — still pre-public if needed.

**Exit criteria:**

- Homepage, article, topic, lab, author, and about templates work
- Fixture article demonstrates diagrams, callouts, code, sources, recommendation
- Citation UX exists without exposing the full evidence ledger
- CI validates frontmatter, YAML, and basic code fences
- Search, RSS, and sitemap work on the built site

---

## E06 — Site chrome and information architecture

**Status:** In progress  
**Phase:** P1  
**Priority:** Critical

### S06.01 — Global navigation

```text
PLATFORM SIGNAL
Articles   Topics   Labs   Field Notes   About
                              Search   Subscribe
```

- [x] Minimal primary nav
- [x] Topics is the taxonomy home, not a mega-menu of everything
- [x] Mobile nav: large targets, no horizontal overflow
- [x] Footer: standards links, persona disclosure, founder/editor

### S06.02 — Homepage (technical magazine, not card dump)

- [x] Masthead + one-line positioning (“Engineering the platforms behind modern software and AI.”)
- [x] One featured story with visual priority
- [x] The Signal module (three editorially chosen items)
- [x] Topic cluster sections (not a dense category grid)
- [x] Featured Lab module (distinct from articles)
- [x] Newsletter CTA (“Get the Signal” / “One useful engineering brief every week.”)
- [x] No identical 20-card grid

### S06.03 — Articles index

- [x] Filter by topic, content type, persona, difficulty
- [x] List-first, not card-first
- [ ] Pagination or “more” without infinite scroll

### S06.04 — Topics taxonomy

Launch clusters:

- AI Systems in Production
- Platform Engineering
- Kubernetes
- AI Agents & Harnesses
- SRE & Observability
- Forward Deployed Engineering

- [x] `/topics` overview
- [x] `/topics/[cluster]` with pillar + supporting articles
- [ ] Internal linking fields in frontmatter drive related reads

### S06.05 — Labs index and lab article variant

- [ ] Labs look like engineering reports, not blog cards
- [ ] Show lab id, environment, hypothesis, duration, versions
- [ ] Distinct visual treatment from standard articles

### S06.06 — Field Notes index

- [ ] Dedicated nav destination for Nia/Marcus field notes
- [ ] Can reuse article list with `contentType: field_note`

### S06.07 — About

- [ ] Publication mission
- [ ] Founder/editor (real name, accountable human)
- [ ] Four personas with disclosure
- [ ] Link to editorial standards and AI process
- [ ] What Platform Signal is not (hype blog, vendor mouthpiece, content farm)

### S06.08 — Author profile pages

`/authors/marcus-reed` (and Maya, Elias, Nia)

- [ ] Role title and one-sentence perspective
- [ ] Territory tags
- [ ] Latest / popular articles
- [ ] Persona disclosure
- [ ] Illustrated portrait
- [ ] Founder/editor page separate from personas

---

## E07 — Article reading experience

**Status:** In progress  
**Phase:** P1  
**Priority:** Critical

This is the most important design surface.

### S07.01 — Article header

- [x] Category · title · thesis/subtitle
- [x] Persona voice attribution (and human name when applicable)
- [x] Published, updated, last reviewed
- [x] Reading time, difficulty (`●●●○○`), optional series
- [ ] Optional hero diagram
- [x] Technology versions / “Applies to” when present

### S07.02 — Three-zone desktop layout

- [x] Left: table of contents
- [x] Center: ~720px prose
- [ ] Right: quiet article info (difficulty, updated, sources, related)
- [x] Mobile: TOC and info collapse into disclosures
- [x] Diagrams/tables may break out to ~1000–1100px

### S07.03 — At a Glance + Why This Matters

- [x] Metadata table for long articles
- [x] Short “Why This Matters” section as a first-class MDX component or convention

### S07.04 — Quick Read / Deep Dive

- [ ] For long articles, two paths through the same page
- [ ] Quick Read jumps to why it matters, architecture, key decisions, recommendation
- [ ] Deep Dive is the full article
- [ ] Do not maintain two duplicate articles

### S07.05 — Callout components

- [x] SIGNAL
- [x] PRODUCTION NOTE
- [x] WATCH OUT
- [x] FIELD NOTE
- [x] Accessible names, not color-only meaning
- [x] Work in light and dark

### S07.06 — Code blocks

- [ ] Language, optional filename, copy button
- [ ] Optional line numbers and highlighted lines
- [ ] Horizontal scroll, no page overflow
- [ ] Accessible markup
- [ ] Track `copy_code` later (P3 analytics), not required to ship the component

### S07.07 — Tables

- [x] Comparison tables as a first-class pattern
- [x] Scroll on mobile
- [x] “Platform Signal take” column allowed

### S07.08 — Recommendation block

- [x] “Use when / wait when” (or equivalent)
- [ ] Required for Deep Dive, Operator Guide, Decision Guide, Lab
- [x] Distinct visual ending before references

### S07.09 — Article end state

No infinite scroll.

- [x] Recommendation
- [x] References
- [x] ~3 related reads
- [ ] Get the Signal CTA
- [ ] Optional series navigation

### S07.10 — Reading progress

- [ ] Subtle top progress
- [ ] Respect reduced motion

### S07.11 — Freshness chrome

Visible:

```text
Published · Updated · Last Reviewed · Applies to · Status
```

- [ ] CURRENT / REVIEW DUE / STALE / ARCHIVED badges
- [ ] `datePublished` / `dateModified` in metadata

---

## E08 — Evidence and citation UX

**Status:** In progress  
**Phase:** P1  
**Priority:** High

### S08.01 — Public references

- [ ] Inline numeric citations
- [ ] Source cards: title, organization, type, date, evidence tier, outbound indicator
- [ ] Optional version / DOI / section
- [x] Labels: PRIMARY SOURCE, SPECIFICATION, RESEARCH, VENDOR DOCUMENTATION, SECONDARY ANALYSIS
- [x] Do not render the full internal ledger on the page

### S08.02 — Structured data

- [ ] Article JSON-LD (`headline`, `datePublished`, `dateModified`, `author`)
- [ ] Organization JSON-LD with `correctionsPolicy` when the page exists
- [ ] Canonical URLs
- [ ] Open Graph / Twitter cards with editorial art (not stock robots)

### S08.03 — Corrections display

- [ ] Material corrections render a visible notice
- [ ] Minor edits do not
- [ ] Correction YAML on the article drives the notice
- [ ] `/corrections` index of material corrections (can be empty at launch)

---

## E09 — Diagram pipeline

**Status:** In progress  
**Phase:** P1  
**Priority:** High

### S09.01 — Diagram standard

Write `docs/standards/DIAGRAM-STANDARD.md`.

- [ ] Every diagram answers a question; omissions are deliberate
- [ ] Version/context required
- [ ] Color-blind safe; light and dark variants or theme-safe SVG
- [ ] Types: reference architecture, sequence, decision tree, failure flow, data flow, control-plane, dependency map, incident timeline

### S09.02 — File layout

```text
content/articles/<slug>/diagrams/
  PS-D-0042.mmd
  PS-D-0042.svg
  PS-D-0042.yml
```

- [x] Metadata: id, title, article_id, type, dates, source_format, license, alt_text, technology_versions
- [x] Alt text required

### S09.03 — Build/CI render

- [ ] Render Mermaid to SVG in GitHub Actions or local script
- [x] Commit SVG (preferred on Hobby so Vercel build stays simple) **or** generate during Next build if fast enough
- [ ] Article figure component: caption, expand, download SVG (copy Mermaid can wait until P4)

### S09.04 — Figure component

- [x] Full-width breakout
- [ ] Full-screen on mobile
- [x] No unreadable tiny SVGs

---

## E10 — Quality automation (CI)

**Status:** In progress  
**Phase:** P1  
**Priority:** High

Content checks run in the GitHub Actions `validate` job from `docs/CI-CD.md`. They must fail the job (and therefore block Vercel) rather than running as a warning. Do not add these as Vercel functions.

### S10.01 — Schema and content CI

- [x] Validate article frontmatter
- [x] Validate `editorial/opportunities/*.yml`, `editorial/briefs/*.yml`, `editorial/calendar.yml`, `editorial/clusters.yml`, `editorial/watchlist.yml`
- [x] Validate `brief.yml`, `evidence.yml`, `editorial/sources.yml`
- [x] Fail on missing required research status for Deep Dive / Operator / Lab
- [ ] Fail on `sponsored: true` without disclosure fields (even if unused)

### S10.02 — Code verification level 1 (always)

Write `docs/standards/CODE-VALIDATION.md`.

- [ ] ShellCheck on shell fences/files
- [ ] YAML parse on manifests
- [ ] JSON parse
- [ ] Markdown fence language sanity
- [ ] Record `codeVerification` metadata when checks run

### S10.03 — Quality score (internal only)

Write `docs/standards/QUALITY-SCORE.md` (120-point rubric).

- [ ] Scoring form or YAML on the PR, not public
- [ ] Thresholds: 105+ exceptional, 95+ publishable, 85–94 revise, <85 hold
- [ ] Hard gates: incorrect claim, failed evidence review, copyright, unsafe security advice, deception, missing disclosure — HOLD regardless of score

### S10.04 — PR editorial template

- [ ] Opportunity id (`PS-O-NNNN`) and Desk `editorial_decision`
- [ ] Content type, primary persona, secondary perspective, cluster
- [ ] Research Editor status
- [ ] Desk final review: READY FOR HUMAN APPROVAL
- [ ] Human Editor-in-Chief approval
- [ ] Quality score (optional until calibrated)
- [ ] Checklist: diagrams, versions, disclosures, related links, word-salad / generic-intro check

---

## E11 — Discovery surfaces (launch-grade)

**Status:** In progress  
**Phase:** P1  
**Priority:** High

### S11.01 — Search

- [x] Header control + keyboard shortcut
- [x] Fast dialog
- [x] Title / topic / article results
- [x] Build-time index (Pagefind or FlexSearch)
- [x] Not an AI chat box

### S11.02 — RSS and sitemap

- [ ] `/sitemap.xml`
- [ ] RSS/Atom for articles
- [ ] Optional RSS for The Signal later
- [ ] `robots.txt`

### S11.03 — 404 and stale content

- [ ] Editorial 404
- [ ] Redirect map for changed slugs (ID remains)
- [ ] ARCHIVED articles remain URL-stable with a banner

---

## E12 — Static pages for trust (copy in P0, pages in P1)

**Status:** Not started  
**Phase:** P1  
**Priority:** High

Implement routes (full policy text can be completed in P2 if needed, but stubs should exist):

- [ ] `/editorial-standards`
- [ ] `/ai-and-editorial-process`
- [ ] `/corrections`
- [ ] `/sponsorship-policy`
- [ ] `/responsible-disclosure`
- [ ] `/about`

---

# PHASE 2 — Launch inventory

**Goal:** 12–15 clustered, internally linked, research-reviewed articles exist in Git, plus remaining public policies.

**Exit criteria:**

- 12–15 launch articles published to `main` (or ready behind a flag)
- Each required type has Research Editor review and human approval
- Clusters interlink; no orphan launch posts
- Policy pages are real, not lorem
- Backup/mirror plan is documented and the first mirror exists

Do not generate all 15 from a blank prompt. Each gets a brief first.

---

## E13 — Launch cluster: AI agents / agent harness (4)

**Status:** Done  
**Phase:** P2  
**Priority:** Critical

### S13.01 — What Is an AI Agent Harness?

- [x] Brief approved (Maya, Deep Dive / Explainer)
- [x] Draft in Maya voice
- [x] Evidence ledger + Research Editor review
- [x] Architecture diagram(s)
- [x] Human approval
- [x] ID assigned

### S13.02 — The Anatomy of a Production AI Agent

- [x] Brief (Maya)
- [x] Layer model diagram
- [x] Research review
- [x] Human approval

### S13.03 — Agent Harness vs Agent Framework vs MCP

- [x] Brief (Maya, Decision Guide)
- [x] Comparison table
- [x] Research review
- [x] Human approval

### S13.04 — What Actually Belongs Inside an Agent Harness?

- [x] Brief (Maya)
- [x] Responsibility-boundary diagram
- [x] Research review
- [x] Human approval

---

## E14 — Launch cluster: Kubernetes + AI infrastructure (3)

**Status:** Deferred  
**Phase:** P2  
**Priority:** High (when Kubernetes is back in scope)

**Parked:** Platform Signal is **not using Kubernetes** for runtime or as the next editorial cluster. Briefs `PS-000005`–`PS-000007` remain planning artifacts only.

### S14.01 — Kubernetes for AI: A Production Architecture Guide

- [x] Brief (Maya or Marcus; architecture-primary → Maya)
- [ ] Reference architecture diagram
- [ ] Version pins
- [ ] Research review
- [ ] Human approval

### S14.02 — Kubernetes GPU Scheduling and DRA Explained

- [x] Brief (Marcus or Maya)
- [ ] DRA / ResourceClaim diagram
- [ ] Maturity and version explicit
- [ ] No unsupported “better utilization” claims without evidence
- [ ] Research review
- [ ] Human approval

### S14.03 — Building an Internal AI Platform on Kubernetes

- [x] Brief (Maya)
- [ ] Control-plane vs runtime split
- [ ] Research review
- [ ] Human approval

---

## E15 — Launch cluster: MCP / agent protocols (2)

**Status:** In progress  
**Phase:** P2  
**Priority:** Critical

### S15.01 — MCP for Platform Engineers

- [x] Brief (Maya)
- [x] Protocol vs product diagram
- [x] Research review
- [x] Human approval

### S15.02 — How to Run MCP Servers as Privileged Workloads

Reframed off Kubernetes. Host-agnostic operator guide (`PS-000009`).

- [x] Brief (Marcus, Operator Guide)
- [x] Identity, authz, blast radius, secrets, audit
- [x] Failure modes
- [x] Research review
- [ ] Human approval

---

## E16 — Launch cluster: platform engineering / SRE (2)

**Status:** In progress  
**Phase:** P2  
**Priority:** Critical

### S16.01 — What Is Agentic Platform Engineering?

- [x] Brief (Maya or Elias)
- [ ] Research review
- [ ] Human approval

### S16.02 — Observability for AI Agents

- [x] Brief (Marcus)
- [ ] OpenTelemetry / tracing of multi-step workflows
- [ ] Research review
- [ ] Human approval

---

## E17 — Launch cluster: FDE / engineering growth (2)

**Status:** In progress  
**Phase:** P2  
**Priority:** High

### S17.01 — What Is a Forward Deployed Engineer?

- [x] Brief (Nia)
- [ ] No fabricated personal war stories; label hypotheticals
- [ ] Research review (strongly recommended)
- [ ] Human approval

### S17.02 — FDE vs Platform Engineer vs Solutions Architect

- [x] Brief (Nia, Decision Guide)
- [ ] Comparison table
- [ ] Research review
- [ ] Human approval

---

## E18 — Launch cluster: The Signal / current analysis (2)

**Status:** In progress  
**Phase:** P2  
**Priority:** High

### S18.01 — Why Everyone Suddenly Wants an MCP Gateway

- [x] Brief (Elias, The Signal format)
- [ ] What happened / why it matters / what changed / who should care / watching next
- [ ] Research review (strongly recommended)
- [ ] Human approval

### S18.02 — The State of Platform Engineering in the Age of AI Agents

- [x] Brief (Elias or Maya)
- [ ] Research review
- [ ] Human approval

---

## E19 — Launch production quality bar

**Status:** Not started  
**Phase:** P2  
**Priority:** Critical

Applies to every launch article.

### S19.01 — Cluster linking

- [ ] From every launch article, 2–4 related launch articles
- [ ] Homepage clusters match real slugs
- [ ] No dead related links

### S19.02 — Visual completeness

- [ ] Every Deep Dive / architecture piece has at least one original diagram
- [ ] Operator pieces have code or manifests where they claim commands
- [ ] Alt text on diagrams
- [ ] Light and dark checked

### S19.03 — Voice differentiation pass

- [ ] Maya pieces sound architectural, not operational
- [ ] Marcus pieces foreground failure/observability/recovery
- [ ] Elias pieces are shorter and timely
- [ ] Nia pieces start from the problem, not the stack
- [ ] No persona claims fake employers, degrees, or “years at Google”

### S19.04 — Research coverage

- [ ] 100% Research Editor review on Deep Dive, Operator Guide, Lab
- [ ] Strongly recommended types actually reviewed for launch
- [ ] Evidence ledgers stored with articles

---

## E20 — Remaining public policies (before public launch)

**Status:** Not started  
**Phase:** P2 (handbook Priority 2; required before *public* launch)  
**Priority:** High

### S20.01 — Corrections policy

- [ ] `docs/editorial/CORRECTIONS-POLICY.md`
- [ ] Minor vs clarification vs material vs retraction
- [ ] How readers report errors
- [ ] `/corrections` and `/corrections` policy copy

### S20.02 — Sponsorship policy

- [ ] `docs/editorial/SPONSORSHIP-POLICY.md`
- [ ] Non-negotiables: no sold rankings, no hidden native ads, no vendor-written “independent” analysis
- [ ] Public `/sponsorship-policy`
- [ ] **Note:** do not run paid sponsorships on Vercel Hobby (commercial use). Policy can exist before revenue.

### S20.03 — Vendor interaction policy

- [ ] `docs/editorial/VENDOR-INTERACTION-POLICY.md`
- [ ] Allowed: briefings, demos, time-limited licenses, docs, interviews — with disclosure
- [ ] Forbidden: promised coverage, conclusion, or full pre-publication approval
- [ ] Factual-check vs editorial-review distinction
- [ ] Gift threshold (safest: avoid material gifts)

### S20.04 — Responsible disclosure

- [ ] `docs/editorial/RESPONSIBLE-DISCLOSURE.md`
- [ ] Public `/responsible-disclosure` with contact, optional encryption, safe harbor for reports *to* Platform Signal
- [ ] Internal workflow: validate privately → notify vendor → coordinate → then publish
- [ ] No working exploit details in public articles

### S20.05 — Content rights policy

- [ ] `docs/editorial/CONTENT-RIGHTS-POLICY.md`
- [ ] Third-party asset metadata: source, creator, license, permission_basis, attribution, used_in
- [ ] Prefer original diagrams
- [ ] Code license/attribution rules
- [ ] Research figure rules
- [ ] AI-generated asset provenance

### S20.06 — Monetization principles (policy only)

- [ ] Allowed future models listed (newsletter sponsor, site sponsor, affiliate, workshops, premium research, etc.)
- [ ] FTC-style disclosure examples on file
- [ ] Explicit: no monetization until Vercel Pro (or other commercial-capable host) and legal review

---

## E21 — Backups and content ownership

**Status:** Not started  
**Phase:** P2  
**Priority:** High

### S21.01 — 3-2-1 for the corpus

- [ ] Primary: GitHub
- [ ] Secondary: scheduled mirror (GitLab / Forgejo / independent remote)
- [ ] Third: monthly compressed archive (git history, MDX, images, diagrams, ledgers, policies, config)
- [ ] Quarterly restore test: clone → install → build → render → verify assets
- [ ] Document in `docs/standards/BACKUP.md`
- [ ] Newsletter subscriber export lives with the email vendor, with periodic export if the vendor allows

---

# PHASE 3 — Public launch

**Goal:** A real URL, indexable pages, a newsletter people can join, and measurement that is not vanity.

**Exit criteria:**

- Custom domain live on Vercel
- Search Console + sitemap submitted
- Newsletter CTA works
- Analytics events defined (even if some are later)
- Launch distribution done for the 15 without spammy identical posts
- Founder can publish a new article via PR → review → merge → Vercel

---

## E22 — Domain, SEO, and production hardening

**Status:** Not started  
**Phase:** P3  
**Priority:** Critical

### S22.01 — Custom domain

- [ ] DNS to Vercel
- [ ] HTTPS
- [ ] `www` vs apex redirect chosen
- [ ] Preview URLs remain noindex

### S22.02 — SEO basics

- [ ] Unique titles/descriptions from frontmatter
- [ ] Canonical tags
- [ ] Heading hierarchy
- [ ] Image alt text
- [ ] Performance: LCP, CLS, no layout-shifting webfonts
- [ ] Self-hosted or `next/font` to avoid extra origin cost

### S22.03 — Indexation

- [ ] Google Search Console property
- [ ] Sitemap submit
- [ ] Bing optional
- [ ] Confirm no accidental `noindex` on production

### S22.04 — Accessibility pass

- [ ] Keyboard nav, search dialog focus trap
- [ ] Contrast in light and dark
- [ ] Callouts not color-only
- [ ] Reduced motion
- [ ] Code blocks and skip-to-content

### S22.05 — Performance budget (Hobby)

- [ ] Article JS kept small; avoid unnecessary client components
- [ ] Diagrams as SVG, not giant PNG
- [ ] Few `next/image` transformations
- [ ] Monitor Fast Data Transfer in Vercel dashboard

---

## E23 — Newsletter as a product (launch slice)

**Status:** Not started  
**Phase:** P3  
**Priority:** High

The full weekly Signal product matures in P4. Launch needs capture + identity.

### S23.01 — Provider and identity

- [ ] Choose Buttondown / Beehiiv / similar (Hobby-friendly, owns the list)
- [ ] Name: **The Signal**
- [ ] Tagline: “The most important developments in production AI, Kubernetes, and platform engineering — filtered for engineers.”
- [ ] Double opt-in if the vendor supports it

### S23.02 — Site integration

- [ ] Header Subscribe + homepage + article-end CTA
- [ ] Simple email field; no dark patterns
- [ ] Success/error states
- [ ] Privacy sentence (what you will send, how often)

### S23.03 — Launch issue

- [ ] Issue 0 or 1: what Platform Signal is, the 15-article map, one “why it matters”
- [ ] At least half the value remains if the reader never clicks through (even for issue 1)

---

## E24 — Analytics model

**Status:** Not started  
**Phase:** P3  
**Priority:** High

### S24.01 — Properties

- [ ] GA4
- [ ] Search Console
- [ ] Vercel Web Analytics (light)
- [ ] Optional Speed Insights (10k events Hobby — one project)

### S24.02 — Event design (implement incrementally)

Do not block launch on all of these.

- [ ] `newsletter_signup`
- [ ] `copy_code`
- [ ] `diagram_expand` / `diagram_download`
- [ ] `source_click`
- [ ] `related_article_click`
- [ ] `search_used`
- [ ] `quick_read_selected` / `deep_dive_selected`

### S24.03 — Success dashboard (manual is fine)

Document the 12-month hypotheses (not guarantees):

- Content: 80–100 articles, 12 Labs, 8–12 pillars, 6 clusters
- Audience directional: 25k monthly organic sessions, 3–5k newsletter subs, rising returning readers
- Authority: 150–250 referring domains
- Quality: low material-correction rate, 100% research coverage on required types, >90% freshness SLA

North star: Monthly Engaged Technical Readers.

- [ ] Spreadsheet or Looker Studio connecting GSC + GA4
- [ ] Do not optimize for pageviews alone

---

## E25 — Launch distribution

**Status:** Not started  
**Phase:** P3  
**Priority:** Medium

### S25.01 — Distribution editor playbook

Write `docs/agents/DISTRIBUTION-EDITOR.md`.

- [ ] Channel-specific outputs: LinkedIn, HN, Reddit, newsletter, short social
- [ ] Never one generic blurb pasted everywhere
- [ ] HN reserved for original technical work/Labs more than explainers
- [ ] Reddit: useful framing, no drive-by spam

### S25.02 — Launch week plan

- [ ] Sequence the 15 (not all 15 links in one day)
- [ ] Founder LinkedIn: one takeaway + one diagram
- [ ] Capture reader questions as Radar opportunity cards in `editorial/opportunities/`

---

# PHASE 4 — First 90 days

**Goal:** Cadence without becoming a content factory. Learn from readers. Ship the first Lab. Keep content fresh by policy, not heroics.

**Exit criteria:**

- ~40 articles
- Weekly Signal for ~12 weeks (or honest reduced cadence if quality requires it)
- One Lab at reproducibility ≥ Level 2
- Freshness queue exists
- Radar scores start using actual GSC data after launch
- Desk weekly report tracks persona and cluster mix
- Publishing still requires a human

---

## E26 — Cadence operations (Radar + Desk)

**Status:** Not started  
**Phase:** P4  
**Priority:** High

Run both Monday operating reports from the agent spec. CI may validate YAML; it does not scrape the web or auto-publish.

### S26.01 — Editorial calendar (Desk state)

- [ ] `editorial/calendar.yml` plus persona_workload / topic_mix / content_type_mix
- [ ] Tuesday deep / Thursday practical / Friday Signal
- [ ] Persona monthly targets: Maya 2, Marcus 2, Elias 2–3, Nia 1–2
- [ ] Mix: 2 deep, 2 operator, 2 signal, 1 field, 1 lab
- [ ] Monday **Editorial Desk** report: publication health, this week, risks, next priorities

### S26.02 — Opportunity Radar (manual first, then light)

Operate `docs/agents/CONTENT-INTELLIGENCE.md`.

- [ ] Monday **Opportunity Radar**: top 5, watch list, declining, refresh candidates
- [ ] Technology signals: K8s releases/KEPs, CNCF, MCP spec, OTel, NVIDIA, vLLM, KServe, Gateway API, GitHub releases, cloud technical changes
- [ ] Research signals: arXiv, conferences, whitepapers, standards — novelty ≠ production practice
- [ ] Search signals: Trends pre-launch; Search Console + related queries + internal search after launch
- [ ] Practitioner signals as pain leads only (issues, HN, Reddit, CNCF, agendas)
- [ ] Cluster opportunity detection and lab-opportunity detection
- [ ] Horizons: NOW (0–30d), NEXT (1–6mo), FOUNDATIONAL
- [ ] First-party GSC loop: existing article attracting adjacent queries → dedicated follow-up card
- [ ] After ~60 days, compare opportunity score vs impressions / conversion / backlinks / completion; write `editorial/performance/`

### S26.03 — Light automation on GitHub Actions

- [ ] Job: list articles with `reviewAfter < today` → `editorial/watchlist.yml` or freshness queue
- [ ] Validate opportunity cards, briefs, calendar YAML in `validate:content` (deploy path)
- [ ] Optional: broken-link check weekly
- [ ] Do not scrape Trends/HN/Reddit from Vercel or from deploy CI
- [ ] `editorial.yml` never deploys

---

## E27 — The Signal as a weekly product

**Status:** Not started  
**Phase:** P4  
**Priority:** High

### S27.01 — Recurring format

```text
01 What Changed (three developments)
02 Why One of Them Matters
03 Research Worth Reading
04 Platform Signal Deep Dive
05 What We're Watching
Optional: One thing we're skeptical about
```

- [ ] Site module stays in sync with the newsletter when possible
- [ ] Elias is the primary voice
- [ ] Archive of Signal issues on the site (MDX)

### S27.02 — Newsletter metrics

- [ ] Subscribers, open/click if available, unsub, article clicks, source, replies
- [ ] Replies feed new Radar opportunity cards

---

## E28 — First Platform Signal Lab

**Status:** Not started  
**Phase:** P4  
**Priority:** High

Write `docs/standards/LAB-REPRODUCIBILITY.md`.

### S28.01 — Reproducibility standard

Levels 0–4 and badges:

- ENVIRONMENT DOCUMENTED
- ARTIFACTS AVAILABLE
- CONFIGURATION VALIDATED
- RESULTS REPRODUCED

Only award what was done.

### S28.02 — First Lab selection (pick one)

Candidates from the cadence doc:

- Can an AI Agent Diagnose a Broken Kubernetes Cluster?
- Running MCP Servers on Kubernetes: Failure Testing
- Comparing GPU Scheduling Approaches
- Tracing a Multi-Agent Workflow with OpenTelemetry
- Evaluating Agent Recovery After Tool Failure

- [ ] Hypothesis, environment, versions, method, evidence, results, limitations, reproduction steps
- [ ] Artifacts in-repo or linked repo + commit SHA
- [ ] Research Editor mandatory
- [ ] No unsafe exploit write-ups; follow responsible disclosure if a vuln appears

### S28.03 — Code verification levels 2–4 (labs and high-value manifests)

- [ ] Level 2: schema validation always; kubectl server-side dry-run **only when Kubernetes content/labs are in scope** — locally or in a disposable cluster, never on Vercel
- [ ] Level 3: execute high-value examples in disposable env; save evidence
- [ ] Level 4: independent reproduction when possible
- [ ] Public “validated on Kubernetes x.y” badge only when true

---

## E29 — Freshness and corrections in production

**Status:** Not started  
**Phase:** P4  
**Priority:** High

### S29.01 — Refresh cycles

- [ ] 90 days: MCP, agents, AI infra, emerging K8s, model serving, agent observability
- [ ] 180 days: platform engineering, architecture principles, SRE, FDE, career
- [ ] Event-triggered: major release, advisory, deprecation, spec change, benchmark change

### S29.02 — Operate the correction system

- [ ] Public error-report path (email or GitHub issue form)
- [ ] Material corrections update article + notice + `/corrections`
- [ ] Evidence ledger updated when claims change

---

## E30 — Measure before scaling volume

**Status:** Not started  
**Phase:** P4  
**Priority:** Medium

After ~30–40 articles:

- [ ] Review GSC queries, CTR, landing pages
- [ ] Newsletter conversion
- [ ] Returning readers, engaged time
- [ ] Backlinks / HN / LinkedIn qualitatively
- [ ] Double down on winning clusters; do not keep a static topic mix if data disagrees
- [ ] Still cap at ~8 excellent articles/month rather than 25 shallow ones

---

# PHASE 5 — Authority (post-90 days)

**Goal:** Hard-to-imitate systems: knowledge graph, diagram library, distribution feedback, optional Pro-tier products.

Do not start this phase just because it is interesting. Start it when P4 exit criteria are met or a specific story is unblocking readers.

---

## E31 — Internal knowledge graph (still Git-native)

**Status:** Not started  
**Phase:** P5  
**Priority:** Medium

### S31.01 — Build-time graph

Entities: ARTICLE, CONCEPT, TECHNOLOGY, PROJECT, SOURCE, AUTHOR, PERSONA, LAB, DIAGRAM, VERSION, ORGANIZATION

- [ ] Generate relationships from frontmatter at build
- [ ] Related content quality improves
- [ ] Topic maps page
- [ ] Still no Neo4j unless the corpus and features demand it

### S31.02 — Refresh uses the graph

- [ ] When Kubernetes version X ships, list articles with that `technologyVersions` key
- [ ] Source URL drift checks against `sources.yml`

---

## E32 — Diagram and architecture library

**Status:** Not started  
**Phase:** P5  
**Priority:** Medium

### S32.01 — Standalone diagram URLs

- [ ] `/diagrams/PS-D-0042`
- [ ] Download SVG, copy Mermaid, version/date
- [ ] Backlink-friendly captions

### S32.02 — Platform Signal Architecture Library

- [ ] Index of reference architectures
- [ ] Filter by topic and version

---

## E33 — Distribution and community loop

**Status:** Not started  
**Phase:** P5  
**Priority:** Medium

### S33.01 — Per-article distribution package

- [ ] LinkedIn, HN (if original), Reddit (if appropriate), newsletter blurb, short social — generated as files in the article folder, human-edited
- [ ] Capture channel, clicks, engagement, signups, backlinks, questions

### S33.02 — Roundtable format

- [ ] One recurring multi-persona feature
- [ ] Template that preserves disagreement
- [ ] Example: “Should enterprises expose infrastructure through MCP?”

---

## E34 — Advanced search and Ask Platform Signal

**Status:** Deferred  
**Phase:** P5+  
**Priority:** Low until corpus and traffic justify it

### S34.01 — Semantic search

- [ ] Embeddings generated in CI or locally, not on each Vercel request
- [ ] Hosting embeddings/query likely needs a paid vector store **and** Vercel Pro or an external API
- [ ] Keep keyword search working

### S34.02 — Ask Platform Signal

- [ ] Answers only from the corpus + citations
- [ ] Must not become the homepage
- [ ] Requires commercial-capable hosting if it is a product feature with API cost

---

## E35 — Code verification maturity and GitHub protection

**Status:** Not started  
**Phase:** P5  
**Priority:** Medium

### S35.01 — Protected main

- [ ] Required status checks: schema, ShellCheck/YAML, build
- [ ] No direct push of articles to `main`

### S35.02 — Lab artifact CI

- [ ] Where licenses allow, run subset of lab scripts in Actions with clearly scoped, non-destructive checks
- [ ] Never run cluster-destructive tests in CI

---

## E36 — Commercialization (requires leaving Hobby)

**Status:** Deferred  
**Phase:** P5+  
**Priority:** Low  
**Hard gate:** Vercel Pro (or another host that allows commercial use) + counsel for material legal questions

### S36.01 — Upgrade hosting

- [ ] Move Vercel project to Pro
- [ ] Confirm commercial-use policy
- [ ] Spend alerts

### S36.02 — First revenue experiment (only after S20.02 / S20.06)

Possible: newsletter sponsorship, clearly labeled site sponsor, affiliate, workshop, premium research, job board

- [ ] Independent editorial clause
- [ ] Clear, prominent disclosure
- [ ] No sold conclusions

---

# PHASE-INDEPENDENT — Agent enablement

These are not a public-site phase. They make *you* faster without autonomous publishing.

Canonical implementation spec: [`PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md`](./PLATFORM-SIGNAL-AGENT-AND-PERSONA-ARCHITECTURE.md).

**Stack (v1):** Python · PydanticAI · LangGraph · LiteLLM · PostgreSQL workflow state · Git (MDX/YAML) as content source of truth · isolated Docker sandbox for code verification.

**Build order:** Author Engine → persona packages → Desk → Evidence → human gate → Git workflow → structured schemas → version metadata → eval suite → **then** Radar → code verification → diagrams → distribution.

Do not add Temporal or a second orchestration layer until operational load justifies it.

---

## E37 — Editorial agent runtime (Author Engine + workflow)

**Status:** In progress  
**Phase:** P0–P4 (incremental)  
**Priority:** High

Prove Phase 1 before Radar automation: manual topic in → Desk → Author → Evidence → revision → human approval.

### S37.01 — Common Author Agent (Author Engine)

- [x] Single author runtime with persona selected at workflow time — **not** four separate agent implementations
- [x] Context assembly: base author + editorial standards + persona package + content type + brief + approved evidence
- [ ] Limit unrestricted web access initially; research requests route to Evidence Editor
- [x] Drafting loop scaffold: brief → outline → draft → evidence → human gate (Desk outline review and revision loop stubbed)
- [x] Output: MDX article / outline paths; PydanticAI Author agent when `--live` or `--test-model`

### S37.02 — Persona package system

See E39. Persona config example (voice sliders, preferred elements, avoid list) versioned like software (`maya-v1.0`, etc.).

### S37.03 — Desk / Managing Editor agent

- [x] PydanticAI agent returning typed `EditorialDecision` / `ArticleBrief` — not unstructured paragraphs
- [x] Protect mission; optimize reader value; preserve persona differences (instructions in agent module)
- [ ] Duplicate / commodity / portfolio-balance checks against opportunities, briefs, and published slugs (corpus tools TBD)
- [x] Assign type, primary persona, optional secondary perspective, visuals (via structured brief)
- [x] Emit structured decision; create brief only after APPROVE or APPROVE WITH REFRAMING
- [x] Cannot mark technical claims verified; cannot override Research Editor; cannot publish

### S37.04 — Evidence Editor agent

- [x] PydanticAI agent returning typed `EvidenceReview`, `ClaimReview`
- [x] Claim extraction from brief + draft (prompt-based; ledger write TBD)
- [x] Must refuse fabricated citations (instructions)
- [x] Permissions: review only — no publish, no policy changes

### S37.05 — LangGraph workflow orchestration

- [x] Explicit stages: topic → Desk → brief → Author → Evidence → human gate (publish/analytics/Radar later)
- [x] Conditional routing: Evidence CHANGES → Author rewrite, **capped at `max_revisions` (default 1)**, then human gate
- [x] Human approval as a **hard interruption** before publish
- [x] Workflow state schema persisted in PostgreSQL (JSON files remain a local fallback when `DATABASE_URL` is unset)

### S37.06 — LiteLLM model routing

- [x] Capability aliases: `research`, `reasoning`, `writer`, `fast`, `local` — not per-persona model names
- [x] Route Desk → reasoning; Evidence → research; Author → writer (via `config/models.yaml` + `PS_MODEL_*` env)
- [x] Tag every request: `workflow_id`, `agent`, `persona`, `workflow_stage`, `content_type`, `model_alias` (PydanticAI metadata)
- [ ] LiteLLM proxy as default gateway (optional `OPENAI_API_BASE`; direct provider strings work today)

### S37.07 — Agent evaluation suite

- [ ] `evals/radar`, `evals/desk`, `evals/evidence`, `evals/marcus`, `evals/maya`, `evals/elias`, `evals/nia`
- [ ] Prompt regression tests before trusting automation (examples in agent architecture doc §15)
- [ ] Capture `workflow_version`, agent versions, persona version on every run

### S37.08 — Topic / Radar agent (Phase 2 — after core workflow)

- [ ] Do **not** build before Phase 1 is trustworthy
- [ ] PydanticAI agent returning typed `OpportunityCard`
- [ ] Four signal categories; search is one input; never invent search volume
- [ ] Submit to Desk; do not skip to authoring

### S37.09 — Human-in-the-loop publishing

- [x] Cursor/agent may open the PR
- [x] GitHub Action may lint
- [ ] Only the human merges to `main`
- [ ] Four-part gate unchanged: Evidence PASS + Desk READY + CI PASS + Human Editor-in-Chief APPROVED

### S37.10 — Cursor interim prompts (optional bridge)

Until the Python runtime ships, Cursor rules/skills may approximate slices of E37. These are **not** the durable implementation.

- [ ] Desk, Evidence, and Author Engine prompt slices aligned with structured output schemas
- [ ] Do not treat four separate Cursor author chats as the long-term architecture

---

## E39 — Persona packages (Author Engine context)

**Status:** In progress  
**Phase:** P0–P1  
**Priority:** High

Personas are portable, versioned context — not separate code paths.

### S39.01 — Repository layout

```text
agents/author/
├── base-author.md
└── personas/
    ├── marcus/
    │   ├── persona.md
    │   ├── voice.md
    │   ├── patterns.md
    │   ├── examples.md
    │   ├── anti-patterns.md
    │   └── review-rubric.md
    ├── maya/
    ├── elias/
    └── nia/
```

- [x] Create layout under `agents/author/` (or `docs/agents/author/` if preferred for docs-only first)
- [x] Keep persona context separate from editorial policy, brief, evidence pack, article state, and model config

### S39.02 — Persona rubrics (from architecture doc §12)

- [x] Marcus: failure modes, observability, recovery, upgrades, blast radius, operational ownership
- [x] Maya: boundaries, control/data plane, responsibilities, tradeoffs, protocol vs implementation
- [x] Elias: what changed, why now, technical meaning, who cares, watch next — anti-clickbait
- [x] Nia: problem first, real constraints, complexity cost, ownership, success criteria — no forced Kubernetes/AI

### S39.03 — Persona versioning

- [ ] Version tags (`maya-v1.0`, etc.) recorded on workflow runs
- [ ] No fine-tuning four persona models at launch — prompt/context engineering first

---

## E38 — Source library tooling

**Status:** Not started  
**Phase:** P1–P4  
**Priority:** Medium

### S38.01 — Zotero (optional, recommended)

- [ ] Collections matching the taxonomy
- [ ] Export or cite keys mapped into `sources.yml`
- [ ] Later: Crossref enrichment for papers (not launch-blocking)

---

# 5. Suggested GitHub tracking (optional)

This markdown file is the working backlog. If you later want GitHub Issues:

| Label | Use |
|---|---|
| `phase-0` … `phase-5` | Phase |
| `epic` | Epic umbrella issue |
| `story` | Implementable story |
| `content` | Article/Lab/Signal work |
| `platform` | Site engineering |
| `editorial` | Policy/process, Radar, Desk |
| `agents` | Control-layer or persona prompt work |
| `hobby-constraint` | Must stay static / no commercial |

One GitHub Milestone per phase (P0–P5) is enough. Do not create 200 issues on day one; file issues when a phase starts.

---

# 6. Definition of done (every story)

A story is done when:

1. The behavior exists in Git on `main` (or the policy file exists, for docs-only work)
2. It matches the relevant product doc, not a generic blog clone
3. It does not violate Hobby constraints (no sneaky SSR, no secrets, no commercial features)
4. Public copy does not pretend personas are real people
5. Technical claims that shipped went through the evidence path appropriate to the content type
6. The story’s checkboxes in this file are updated

---

# 7. What we will not do

- Launch with 3–5 thin posts, or wait for 40 posts before learning
- Fully autonomous publishing (Radar, Desk, authors, and Research Editor all cannot publish)
- Letting SEO or Trends define what the publication believes is important
- Merging The Radar and The Desk into one agent
- Four separate persona agent runtimes or per-persona fine-tuned models at launch
- Radar automation before the Desk → Author → Evidence → human loop is proven
- One generic AI voice with four names
- Pageview-maximizing titles
- Vendor-written independent analysis
- Neo4j, RAG chat, or agent runtimes on Vercel Hobby
- Storing canonical articles only in a hosted CMS
- Publishing Labs that cannot state environment and versions
- Monetizing while the site is on the Hobby (non-commercial) plan

---

# 8. Immediate next session

This section is a pointer. The working snapshot is **[Now / Next](#now--next)** at the top of this file.

Recommended next piece of work: platform engineering / SRE cluster (`PS-000010`). Kubernetes cluster (`PS-000005`–`000007`) is deferred.
