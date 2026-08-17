# Platform Signal — Editorial, Research, Governance & Growth Operating Handbook

**Version:** 1.0  
**Date:** August 17, 2026  
**Purpose:** Deep-dive operating guidance for the 25 major areas Platform Signal should work through before scaling publication volume.

> **Scope note:** This handbook combines current public guidance from Google Search, the FTC, SPJ, CISA, CERT/CC, NIST, GitHub, Kubernetes, ACM, Creative Commons, Crossref, Zotero, and related primary sources with concrete recommendations tailored to Platform Signal.
>
> **Control-layer agents:** The detailed spec for the Editorial Agent (The Desk) and the Topic Research / Opportunity Agent (The Radar) is [`PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](./PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md). That document is canonical for scoring models, decision statuses, opportunity cards, agent-to-agent contracts, weekly Radar/Desk reports, and hard “neither agent publishes” rules. Sections 2 and 3 below remain useful context; where they conflict, the agent spec wins.
>
> **Legal note:** Sections involving copyright, sponsorship disclosure, privacy, or other legal issues are operational guidance, not legal advice. Consult qualified counsel for material legal questions.

---

# Executive Summary

Platform Signal is no longer just a website project. The combination of:

- Distinct editorial personas
- A Technical Research Editor
- Evidence-led publication
- Strong technical design
- Original Labs
- A recurring Signal briefing
- A Git-native publishing workflow

creates the foundation for an **AI-assisted technical newsroom**.

The next phase should focus on making that newsroom disciplined, transparent, measurable, and difficult to imitate.

The 25 areas in this handbook fall into six operating layers:

```text
GOVERNANCE
  Editorial standards
  Corrections
  Sponsorship/vendor policy
  Responsible disclosure
  Legal/content rights

EDITORIAL OPERATIONS
  Managing editor
  Article briefs
  Content formats
  Human approval
  Quality scoring

CONTENT INTELLIGENCE
  Topic research
  Source library
  Knowledge graph
  Article identifiers
  Freshness/versioning

TECHNICAL QUALITY
  Research editor
  Evidence UX
  Diagram pipeline
  Code verification
  Reproducibility

AUDIENCE & DISTRIBUTION
  Distribution agent
  Newsletter identity
  Analytics
  Success metrics

BUSINESS & RESILIENCE
  Monetization principles
  Backups/content ownership
```

The highest-priority work before producing the first 15 launch articles is:

1. Editorial Standards
2. Managing Editor definition
3. Article Brief template
4. Content Intelligence workflow
5. Evidence Ledger + article metadata schema
6. Corrections/freshness policy
7. Code and artifact verification standards

---

# 1. Editorial Standards & Trust Policy

## Why This Matters

Every author persona can have a different voice, but the publication needs **one non-negotiable standard for truth, disclosure, sourcing, independence, and accountability**.

Google’s current Search guidance strongly emphasizes helpful, reliable, people-first, non-commodity content. Its generative-AI guidance explicitly says AI can help with research and structure, but large-scale generation without added value can violate spam policies.

The Society of Professional Journalists’ Code of Ethics emphasizes:

- Seeking truth and reporting it
- Independence
- Accountability
- Transparency
- Prompt corrections

Those principles translate well to a technical publication.

## Platform Signal Recommendation

Create an `EDITORIAL-STANDARDS.md` that is treated as the publication constitution.

### Required Principles

#### Accuracy

- Material technical claims require evidence.
- Version-specific claims must include relevant versions.
- Benchmarks must disclose methodology.
- Predictions must be labeled as predictions.
- Opinion must not be written as fact.

#### Primary Sources

Prefer:

1. Specifications
2. Official documentation
3. Standards
4. Research papers
5. Maintainer documentation

before secondary commentary.

#### AI Transparency

Platform Signal should disclose that:

- Editorial personas are not represented as real-world people.
- AI may assist research, drafting, summarization, or editing.
- Technical claims are reviewed through an evidence process.
- A human editor retains publication accountability.

#### Independence

Editorial conclusions cannot be purchased.

#### Corrections

Material errors are corrected transparently rather than silently.

#### Conflicts of Interest

Disclose:

- Sponsorship
- Affiliate relationships
- Free products/services
- Vendor access
- Consulting relationships where relevant

## Recommended Public Pages

Create:

```text
/editorial-standards
/corrections
/sponsorship-policy
/ai-and-editorial-process
/responsible-disclosure
```

## Recommended Internal Policy Sections

```text
1. Mission
2. Accuracy
3. Sources
4. Research standards
5. AI-assisted content
6. Author personas
7. Corrections
8. Independence
9. Sponsorship
10. Affiliate relationships
11. Vendor briefings
12. Security disclosures
13. Copyright
14. Conflicts of interest
15. Human publication approval
```

## Pitfalls

Avoid vague statements like:

> “We strive for accuracy.”

Instead define operational behaviors.

## Sources

- Google Search — Creating Helpful, Reliable, People-First Content:  
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search — Guidance on Generative AI Content:  
  https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Society of Professional Journalists — Code of Ethics:  
  https://www.spj.org/spj-code-of-ethics/

---

# 2. Managing Editor Agent

> **Canonical detail:** [`PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](./PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md) Part I — Editorial Agent / **The Desk**. Use that document for editorial-fit scoring, decision statuses (APPROVE / APPROVE WITH REFRAMING / HOLD / MERGE / REJECT / WATCH), persona assignment, briefs, guardrails, and the weekly Desk report.

## Why This Matters

The Technical Research Editor answers:

> Is this technically true and supported?

That is different from:

> Should Platform Signal publish this story, in this format, for this audience, right now?

Those responsibilities belong to a Managing Editor.

If one agent owns both functions, technical fact checking will gradually expand into editorial decision-making and lose independence.

## Recommended Role

# Platform Signal Managing Editor

Mission:

> Maintain editorial coherence, assign work, enforce quality, and determine publication readiness without replacing technical evidence review.

## Responsibilities

### Before Writing

- Review topic opportunity
- Check for duplicate coverage
- Determine audience
- Assign content type
- Assign author persona
- Define thesis
- Approve brief

### During Production

- Check scope
- Prevent article drift
- Ensure article has a useful narrative
- Coordinate author and research-editor revisions

### Before Publication

- Validate readability
- Check visual completeness
- Confirm disclosure
- Confirm required research-editor status
- Ensure title matches article
- Approve final publication

## What the Managing Editor Should NOT Do

It should not:

- Override unsupported facts because they make the article stronger
- Invent sources
- Approve technical claims without evidence
- Automatically publish
- Rewrite every article into the same voice

## Workflow

```text
Content Intelligence
      ↓
Managing Editor
      ↓
Article Brief
      ↓
Author Persona
      ↓
Technical Research Editor
      ↓
Revision
      ↓
Managing Editor
      ↓
Human Approval
      ↓
Publish
```

## Recommended Output

```yaml
editorial_decision:
  status: approved_for_draft
  content_type: deep_dive
  author_persona: maya
  priority: high
  audience:
    - platform architects
    - staff engineers
  thesis:
  unique_angle:
  required_visuals:
  required_evidence:
  target_publish_window:
```

## Key Metric

The Managing Editor should optimize for:

**Editorial portfolio quality**, not raw output count.

---

# 3. Content Intelligence / Topic Opportunity Agent

> **Canonical detail:** [`PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](./PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md) Part II — Topic Research / Opportunity Agent / **The Radar**. Use that document for the four signal categories, opportunity-card schema, lifecycle, commodity check, cluster/lab detection, and weekly Radar. Its 100-point opportunity score **supersedes** the weight table later in this section.

## Why This Matters

Publishing based only on intuition risks:

- Missing emerging topics
- Writing too late
- Writing oversaturated topics
- Creating content nobody is searching for
- Over-indexing on personal interests

Google Trends provides current and historical search-interest signals. Search Console reveals what queries already produce impressions and clicks for the site. Google explicitly recommends using Search Console and Trends together when investigating performance changes.

## Recommended Role

# Platform Signal Content Intelligence Agent

Mission:

> Identify and prioritize topics where technical importance, audience need, search opportunity, and Platform Signal differentiation intersect.

## Inputs to Monitor

### Primary / Official

- Kubernetes releases
- Kubernetes Enhancement Proposals
- CNCF reports and blogs
- OpenTelemetry
- MCP specification and releases
- Major AI infrastructure projects
- GitHub releases
- NVIDIA technical releases
- Red Hat / Microsoft / Google / AWS technical documentation
- Academic papers

### Demand Signals

- Google Trends
- Search Console
- Google autocomplete/search suggestions
- Related searches
- Internal site search
- Newsletter clicks
- Community questions

### Community Signals

- Hacker News
- Reddit
- GitHub issues/discussions
- CNCF Slack/community discussions
- Conference schedules

Community discussion is a lead source, not necessarily a factual source.

## Opportunity Score

Recommended 100-point model:

| Dimension | Weight |
|---|---:|
| Platform Signal fit | 20 |
| Reader usefulness | 20 |
| Technical momentum | 15 |
| Search opportunity | 15 |
| Originality gap | 15 |
| Evidence availability | 5 |
| Evergreen potential | 5 |
| Distribution potential | 5 |

Example:

```text
Topic: Agent Identity on Kubernetes

Platform Signal Fit       20/20
Reader Usefulness         18/20
Technical Momentum        14/15
Search Opportunity        11/15
Originality Gap           14/15
Evidence Availability      5/5
Evergreen Potential        4/5
Distribution Potential     5/5

TOTAL                     91/100
```

## Topic States

```text
discovered
watching
research-worthy
brief-ready
assigned
published
refresh-opportunity
retired
```

## Critical Rule

Trending does not equal important.

Google Trends measures **relative search interest**, not an absolute vote of technical significance.

## Deliverables

Create:

- `TOPIC-SCORING-RUBRIC.md` (Radar opportunity score + Desk editorial-fit score; see the agent spec)
- `editorial/opportunities/PS-O-NNNN.yml`
- `editorial/clusters.yml` and `editorial/watchlist.yml`
- Weekly Opportunity Radar and Editorial Desk reports
- Monthly cluster-performance report in `editorial/performance/`

## Sources

- Google Trends: https://trends.google.com/trends/
- Google Trends FAQ: https://support.google.com/trends/answer/4365533
- Google Trends related searches: https://support.google.com/trends/answer/4355000
- Google Search Console guidance:  
  https://developers.google.com/search/docs/monitor-debug/search-console-start

---

# 4. Article Briefs Before Drafts

## Why This Matters

A blank-page instruction such as:

> Write 3,000 words about MCP security.

produces generic content because the writer has no editorial hypothesis.

An article brief separates:

**Thinking** from **writing**.

This is particularly important in AI-assisted workflows because agents can generate plausible prose long before the editorial question has been properly defined.

## Required Article Brief

Every substantial article should begin with structured metadata.

```yaml
article_id:
working_title:
content_type:
author_persona:
priority:

target_reader:
reader_problem:

primary_question:
secondary_questions:

central_thesis:
why_now:

primary_keyword:
secondary_keywords:
search_intent:

known_competing_content:
content_gap:
platform_signal_unique_angle:

claims_to_verify:
  -

primary_sources:
  -

required_diagrams:
  -

required_code_examples:
  -

production_questions:
  -

security_questions:
  -

expected_conclusion:

internal_links:
  -

target_length:
target_publish_date:
refresh_cycle:
```

## Brief Approval Gate

An article should not move to drafting unless:

- Audience is specific
- Thesis is clear
- Unique value is identified
- Evidence appears obtainable
- Article fits a cluster
- Author persona fits
- Article type is defined

## Recommended Naming

Store briefs alongside articles:

```text
content/articles/<slug>/
├── brief.yml
├── index.mdx
├── evidence.yml
├── diagrams/
└── code/
```

## Failure Modes

### Keyword-first brief

Bad:

> Primary keyword: “AI agents Kubernetes”

Good:

> Reader needs to understand which cluster permissions an operational agent should receive and why.

### Thesis-free brief

Bad:

> Explain DRA.

Good:

> Explain why DRA changes the resource contract between Kubernetes workloads and specialized hardware, then identify when platform teams should migrate.

---

# 5. Define Content Types Precisely

## Why This Matters

A publication becomes easier to navigate when readers understand the editorial contract.

A “Lab” should promise something different from a “Signal.”

## Recommended Platform Signal Formats

### Deep Dive

**Length:** 2,500–5,000 words  
**Purpose:** Durable authoritative technical reference.

Required:

- Architecture
- Sources
- Tradeoffs
- Recommendation

Primary authors:

- Maya
- Marcus

---

### Operator Guide

**Length:** 1,500–3,000  
**Purpose:** Production implementation and operations.

Required:

- Failure modes
- Observability
- Recovery/operations
- Version context

Primary author:

- Marcus

---

### The Signal

**Length:** 600–1,500  
**Purpose:** Timely technical development.

Required:

```text
What happened?
Why does it matter?
What changed technically?
Who should care?
What are we watching next?
```

Primary author:

- Elias

---

### Field Note

**Length:** 800–1,800  
**Purpose:** Practical observation or implementation lesson.

Primary author:

- Nia
- Marcus

---

### Platform Signal Lab

**Length:** 2,000–5,000+  
**Purpose:** Original experiment.

Required:

- Hypothesis
- Environment
- Versions
- Method
- Evidence
- Results
- Limitations
- Reproduction instructions

---

### Explainer

**Length:** 1,200–2,500  
**Purpose:** Establish vocabulary and conceptual understanding.

---

### Decision Guide

**Length:** 1,500–3,000  
**Purpose:** Help a reader choose.

Required:

- Decision criteria
- Comparison
- Tradeoffs
- Recommendation by use case

---

### Roundtable

Multiple personas answer one technical question.

Purpose:

- Show legitimate disagreement
- Present tradeoffs
- Build publication identity

---

### Reference Architecture

Can be article-length or visual-first.

Required:

- Components
- Data/control flow
- Assumptions
- Security
- Failure boundaries
- Version/date

---

# 6. Build a Source Library

## Why This Matters

Repeatedly searching the open web wastes time and increases source-quality variance.

Platform Signal should maintain a curated evidence corpus.

Zotero supports hierarchical collections and tags, while a single source can belong to multiple collections without duplication. Crossref provides metadata for scholarly publications, including DOIs, authors, licenses, funding, and update information.

## Recommended Source Taxonomy

```text
KUBERNETES/
  official-docs
  KEPs
  SIGs
  releases

PLATFORM-ENGINEERING/
  CNCF
  Backstage
  DORA

AI-AGENTS/
  MCP
  A2A
  agent frameworks
  research

OBSERVABILITY/
  OpenTelemetry
  Prometheus
  Grafana

AI-INFRASTRUCTURE/
  NVIDIA
  KServe
  vLLM
  inference

SECURITY/
  NIST
  CISA
  OWASP

RESEARCH/
  papers
  surveys
  whitepapers
```

## Source Metadata

```yaml
source_id:
title:
organization:
url:
type:
tier:
topics:
published_at:
updated_at:
version:
retrieved_at:
license:
doi:
notes:
```

## Source Tiers

Use the Research Editor hierarchy:

- Tier 1 — specification, official docs, standards, original research
- Tier 2 — vendor engineering / maintainer docs
- Tier 3 — reputable technical journalism/practitioner work
- Tier 4 — community discussion

## Recommended Tooling

Initially:

- Zotero for research library
- Git/YAML for article evidence ledgers

Later:

- Searchable source database
- Automated freshness monitoring
- Crossref API enrichment for papers

## Sources

- Zotero Collections & Tags:  
  https://www.zotero.org/support/collections_and_tags
- Crossref REST API:  
  https://www.crossref.org/documentation/retrieve-metadata/rest-api/

---

# 7. Citation & Evidence UX

## Why This Matters

If evidence is part of the brand, citations should not look like an academic afterthought.

Schema.org’s `CreativeWork` model supports citation relationships. Google’s Article structured-data guidance supports clear author and date metadata.

## Public Citation Pattern

Inline:

```text
Kubernetes added the capability in version X.[1]
```

Evidence area:

```text
[1] Kubernetes Documentation
    Dynamic Resource Allocation
    Kubernetes SIG Node
    Primary source
    Last accessed: Aug 17, 2026
```

## Recommended Source Card

Display:

- Source title
- Organization
- Type
- Date
- Evidence tier
- External-link indicator

Optional:

- Relevant section
- Version
- DOI

## Evidence Labels

Consider:

```text
PRIMARY SOURCE
SPECIFICATION
RESEARCH
VENDOR DOCUMENTATION
SECONDARY ANALYSIS
```

## Future Enhancements

- Hover source preview
- “View evidence” drawer
- Claim-level evidence markers for Labs
- Export citations
- JSON-LD citation relationships

## Recommendation

Do not publicly expose the full internal Evidence Ledger by default.

Instead expose enough sourcing to make claims auditable without making articles visually exhausting.

## Sources

- Schema.org CreativeWork / citation:  
  https://schema.org/CreativeWork
- Google Article structured data:  
  https://developers.google.com/search/docs/appearance/structured-data/article

---

# 8. Correction System

## Why This Matters

Technical publishing guarantees eventual mistakes because:

- Products change
- Documentation changes
- Bugs are fixed
- Authors misinterpret evidence
- Version boundaries are missed

Credibility comes from handling errors visibly.

SPJ explicitly emphasizes acknowledging mistakes and correcting them promptly and prominently.

## Correction Categories

### Minor Edit

Examples:

- Typo
- Grammar
- Formatting

No visible correction notice required.

### Technical Clarification

Meaning unchanged, but wording improved.

Optionally note in revision history.

### Material Correction

Examples:

- Wrong version
- Incorrect feature maturity
- Incorrect command
- Misstated architecture behavior

Requires visible notice.

### Retraction / Withdrawal

Rare.

Use when core conclusions are unreliable.

## Recommended Correction Notice

```text
Correction — August 25, 2026

An earlier version of this article stated that
Feature X became generally available in Kubernetes 1.35.

The feature became generally available in Kubernetes 1.36.

The article and affected diagram have been corrected.
```

## Metadata

```yaml
corrections:
  - date:
    severity: material
    summary:
    sections_affected:
```

## Correction Policy Page

Explain:

- How readers report errors
- What happens after a report
- Difference between minor edits and corrections
- How retractions are handled

## Sources

- SPJ Code of Ethics:  
  https://www.spj.org/spj-code-of-ethics/
- Schema.org includes `correctionsPolicy` for organizations:  
  https://schema.org/CreativeWork

---

# 9. Article Freshness & Versioning

## Why This Matters

For Platform Signal, “correct when published” is insufficient.

A Kubernetes article can become outdated while remaining technically polished.

Google recommends visible publication dates and accurate `datePublished` / `dateModified` metadata where appropriate.

## Recommended Visible Metadata

```text
Published: Aug 21, 2026
Updated: Nov 18, 2026
Last Reviewed: Nov 18, 2026
Applies to: Kubernetes 1.36
Status: CURRENT
```

## Article States

```text
CURRENT
REVIEW DUE
STALE
ARCHIVED
```

## Metadata

```yaml
publishedAt:
updatedAt:
lastReviewedAt:
reviewAfter:
status:
technologyVersions:
  kubernetes:
  openshift:
  mcp_spec:
```

## Refresh Cycles

### 90 days

Use for:

- MCP
- Agent frameworks
- AI infrastructure
- Kubernetes emerging features
- Model serving
- Agent observability

### 180 days

Use for:

- Platform engineering
- Architecture principles
- SRE
- FDE
- Career content

### Event-triggered

Refresh immediately after:

- Major release
- Security advisory
- Deprecation
- Spec change
- Important benchmark change

## Automated Freshness Check

Weekly job:

```text
Find articles where reviewAfter < today
        ↓
Create editorial queue
        ↓
Research Editor checks source/version drift
```

## Sources

- Google Article structured data:  
  https://developers.google.com/search/docs/appearance/structured-data/article
- Google publication-date guidance:  
  https://developers.google.com/search/docs/appearance/publication-dates

---

# 10. Internal Knowledge Graph

## Why This Matters

A flat set of articles is enough for a blog.

A technical publication benefits from understanding relationships among:

- Concepts
- Technologies
- Articles
- Authors
- Sources
- Versions
- Labs
- Diagrams

This later powers:

- Better related content
- Topic maps
- Semantic search
- Ask Platform Signal
- Refresh workflows

## Recommended Entities

```text
ARTICLE
CONCEPT
TECHNOLOGY
PROJECT
SOURCE
AUTHOR
PERSONA
LAB
DIAGRAM
VERSION
ORGANIZATION
```

## Example

```text
Kubernetes
   │
   ├── DRA
   │    ├── ResourceClaim
   │    ├── GPU
   │    └── NVIDIA
   │
   ├── Gateway API
   │    └── Inference Extension
   │
   └── Observability
        └── OpenTelemetry
```

## Simple MVP

Do not deploy Neo4j on day one.

Use structured frontmatter:

```yaml
concepts:
  - kubernetes
  - dynamic-resource-allocation

relatedTechnologies:
  - nvidia-gpu-operator

dependsOn:
  - kubernetes-resource-api

sources:
  - SRC-K8S-DRA-001
```

Generate relationships during build.

## Future

A relational or graph database becomes justified when:

- Corpus grows substantially
- Semantic features need dynamic querying
- User personalization appears

---

# 11. Permanent Article IDs

## Why This Matters

URLs and titles change.

Internal identity should not.

## Recommended Format

```text
PS-2026-0001
PS-2026-0002
```

or category-aware:

```text
PS-AI-0027
PS-K8S-0019
```

I recommend sequential IDs without topic semantics because article categories may change:

```text
PS-000001
```

## Frontmatter

```yaml
id: PS-000001
slug: what-is-an-agent-harness
```

## Use the ID For

- Evidence ledgers
- Analytics
- Content relationships
- Corrections
- Diagram ownership
- APIs
- Embeddings
- RAG
- Editorial workflow

## Important Principle

The ID is immutable.

The slug can redirect.

---

# 12. Diagram Pipeline

## Why This Matters

Architecture diagrams are intended to become a Platform Signal signature asset.

That means diagrams need provenance and lifecycle management like code.

## Recommended Structure

```text
content/articles/<slug>/diagrams/
├── PS-D-0042.mmd
├── PS-D-0042.svg
└── PS-D-0042.yml
```

Metadata:

```yaml
id: PS-D-0042
title:
article_id:
type: architecture
created_at:
updated_at:
source_format: mermaid
license:
alt_text:
technology_versions:
```

## Diagram Standards

Every diagram should answer:

- What question does this diagram help answer?
- What is deliberately omitted?
- What version/context does it represent?
- Is direction of flow clear?
- Are control and data paths distinguishable?
- Can a color-blind reader understand it?
- Does it work in light and dark mode?

## Reusable Diagram Types

- Reference architecture
- Sequence
- Decision tree
- Failure flow
- Data flow
- Control-plane model
- Dependency map
- Incident timeline

## Public Features

Eventually support:

- Full-screen
- Download SVG
- Copy Mermaid
- Link directly to diagram
- Diagram version/date

## Long-Term Opportunity

Create:

# Platform Signal Architecture Library

Diagrams can become standalone search and backlink assets.

---

# 13. Code Verification Pipeline

## Why This Matters

An evidence-based technical publication loses credibility quickly when commands or YAML are invalid.

GitHub protected branches can require status checks before merge. Kubernetes supports server-side validation, and ShellCheck is specifically designed to identify shell syntax and semantic problems.

## Recommended Verification Levels

### Level 1 — Static

Always:

- ShellCheck for shell examples
- YAML parsing
- JSON parsing
- Type/language syntax checks
- Markdown code-fence checks

### Level 2 — Schema

For Kubernetes:

- `kubectl` server-side dry run where feasible
- schema validation
- version-matched API validation

### Level 3 — Execution

For high-value examples:

- Run commands in disposable environment
- Verify expected output
- Save test evidence

### Level 4 — Reproduction

For Labs:

- Rebuild environment
- Execute experiment from documented steps
- Compare results

## Example Metadata

```yaml
codeVerification:
  status: verified
  verifiedAt: 2026-08-17
  environment:
    kubernetes: 1.36.1
  checks:
    shellcheck: pass
    yaml: pass
    kubernetes_server_dry_run: pass
```

## Reader Trust Signal

Possible:

```text
✓ Configuration validated
Tested with Kubernetes 1.36.1
```

Only show this when genuinely validated.

## CI Integration

Require checks before merging article PRs.

## Sources

- GitHub Protected Branches:  
  https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches
- ShellCheck:  
  https://github.com/koalaman/shellcheck
- Kubernetes `kubectl apply`:  
  https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/

---

# 14. Internal Article Quality Score

## Why This Matters

A score is useful when it turns fuzzy quality into a consistent review rubric.

It becomes harmful when used as an automatic substitute for editorial judgment.

## Recommended 120-Point Score

| Dimension | Points |
|---|---:|
| Technical accuracy | 20 |
| Evidence quality | 20 |
| Originality | 15 |
| Production relevance | 15 |
| Reader usefulness | 15 |
| Readability | 10 |
| Visual explanation | 10 |
| Operational/security coverage | 10 |
| Internal linking / cluster fit | 5 |
| **Total** | **120** |

## Suggested Thresholds

```text
105–120   Exceptional
95–104    Publishable
85–94     Revision required
<85       Hold
```

## Hard Gates

Regardless of numerical score, HOLD if:

- Material claim is incorrect
- Evidence review fails
- Major plagiarism/copyright issue
- Security recommendation is unsafe
- Article is deceptive
- Required disclosure is missing

## Important Rule

Do not expose the numerical score publicly initially.

Use it for internal consistency.

---

# 15. Avoid Fully Autonomous Publishing

## Why This Matters

Google’s guidance warns against scaled AI-generated pages that do not add user value.

More importantly, Platform Signal’s credibility depends on accountability.

An agent cannot own reputational consequences in the way the publication owner can.

## Recommended Policy

Agents may:

- Discover topics
- Research
- Draft
- Analyze competitors
- Verify claims
- Suggest corrections
- Generate metadata
- Generate diagrams
- Validate code

Agents may **not autonomously publish production content**.

## Human Approval Gate

Before publish:

```text
Technical Research Review: PASS
Managing Editor: APPROVED
Automated Checks: PASS
Human Editor: APPROVED
```

## Human Review Should Check

- Does the article genuinely add value?
- Would I defend this recommendation publicly?
- Is the tone appropriate?
- Is anything technically plausible but misleading?
- Are disclosures adequate?
- Does this sound like Platform Signal?

## Sources

- Google Search generative-AI guidance:  
  https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Google people-first guidance:  
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content

---

# 16. Distribution Agent

## Why This Matters

Publishing is only half the job.

Technical articles need deliberate distribution to reach communities where readers already spend time.

## Recommended Role

# Platform Signal Distribution Editor

Input:

- Final published article
- Audience
- Content type
- Key findings

Output tailored by channel.

## Channel-Specific Outputs

### LinkedIn

- Professional context
- 1 strong takeaway
- 1 diagram/visual
- Discussion question

### Hacker News

- Plain title
- Minimal marketing
- Best for original technical work/Labs

### Reddit

- Community-specific framing
- Explain why it is useful
- Avoid drive-by link spam

### Newsletter

- 2–4 sentence summary
- Why it matters
- Link

### Short social

- Key stat
- Counterintuitive finding
- Diagram snippet
- Quote

## Rule

Never generate one generic promotional paragraph and paste it to every platform.

## Feedback Loop

Capture:

```text
channel
post
clicks
engagement
newsletter_signups
backlinks
comments/questions
```

Reader questions should feed Content Intelligence.

---

# 17. Newsletter as a Product

## Why This Matters

A newsletter should not be:

> “Here are links to things we published.”

It should have standalone editorial value.

## Recommended Product

# The Signal

Tagline:

> The most important developments in production AI, Kubernetes, and platform engineering — filtered for engineers.

## Weekly Format

### 1. What Changed

Three developments.

### 2. Why One of Them Matters

One deeper explanation.

### 3. Research Worth Reading

One paper, whitepaper, or primary technical source.

### 4. Platform Signal Deep Dive

One relevant article.

### 5. What We're Watching

One emerging item not yet mature enough for a full article.

### Optional

> One thing we're skeptical about.

This fits the publication exceptionally well.

## Metrics

Track:

- Subscriber growth
- Open rate where available
- Click rate
- Unsubscribe rate
- Article clicks
- Subscriber source
- Reply rate
- Conversion from article reader to subscriber

## Editorial Rule

At least half of newsletter value should still exist if the reader never clicks a Platform Signal article.

---

# 18. Analytics Beyond Pageviews

## Why This Matters

Traffic alone can reward shallow clickbait.

Google Search Console provides:

- Impressions
- Clicks
- CTR
- Search queries
- Page-level performance

GA4 can measure engagement and events; its enhanced measurement can track content interactions such as scroll events.

## Metric Layers

### Acquisition

- Organic search
- Direct
- Newsletter
- Referral
- Social

### Search

- Impressions
- Clicks
- CTR
- Query growth
- Landing pages

### Engagement

- Engaged time
- Scroll depth
- Article completion proxy
- Related article clicks
- Search use
- Code-copy events
- Diagram opens/downloads

### Authority

- Backlinks
- Referring domains
- Citations
- Newsletter subscribers
- Returning-reader rate

### Editorial

- Performance by author persona
- Performance by topic
- Performance by content type
- Traffic per publishing hour
- Refresh lift

## Custom Events

```text
newsletter_signup
article_complete
copy_code
diagram_expand
diagram_download
source_click
related_article_click
search_used
quick_read_selected
deep_dive_selected
```

## Sources

- Google Search Console + Analytics for SEO:  
  https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console
- GA4 Enhanced Measurement:  
  https://support.google.com/analytics/answer/9216061
- GA4 User Engagement:  
  https://support.google.com/analytics/answer/11109416

---

# 19. Define Success Before Launch

## Why This Matters

Without explicit goals, the team will optimize whichever metric is easiest to see.

## Recommended 12-Month Objectives

These should be treated as hypotheses, not guarantees.

### Content

```text
80–100 strong published articles
12 Labs
8–12 pillar/reference guides
6 mature topic clusters
```

### Audience

Possible directional targets:

```text
Monthly organic sessions: 25,000+
Newsletter subscribers:   3,000–5,000+
Returning-reader rate:    increasing quarter over quarter
```

### Authority

```text
Referring domains:        150–250+
Meaningful technical citations/backlinks
Community mentions
```

### Quality

```text
Material correction rate: low
Research-editor coverage: 100% on required content types
Code validation coverage: increasing
Freshness SLA compliance: >90%
```

## North-Star Metric

I would not use pageviews.

Consider:

> **Monthly Engaged Technical Readers**

Definition example:

A unique reader who does at least one:

- Engages >2 minutes
- Reads multiple articles
- Copies code
- Opens a diagram
- Subscribes
- Returns within 30 days

This better reflects publication value.

---

# 20. Monetization Principles Before Monetization

## Why This Matters

FTC guidance requires endorsements and advertising to be truthful and not misleading. Native advertising disclosures need to be clear and prominent enough that readers recognize advertising as advertising.

Create rules before revenue creates incentives.

## Recommended Principles

Platform Signal will not:

- Sell rankings
- Sell positive reviews
- Hide sponsorship relationships
- Publish vendor-written content as independent analysis
- Change technical conclusions for sponsors
- Suppress material negatives for affiliates

## Allowed Monetization

Potentially:

- Newsletter sponsorship
- Clearly labeled site sponsorship
- Affiliate relationships
- Sponsored research with independence clause
- Workshops
- Premium research
- Consulting/advisory
- Courses
- Job board

## Disclosure Examples

Good:

```text
SPONSORED

This edition of The Signal is sponsored by ExampleCo.
The sponsor had no editorial control over the articles
or recommendations in this issue.
```

Affiliate:

```text
Platform Signal may receive a commission if you purchase
through this link. This does not affect our editorial evaluation.
```

## Sources

- FTC Endorsement Guides:  
  https://www.ftc.gov/news-events/topics/truth-advertising/advertisement-endorsements
- FTC Native Advertising Guide:  
  https://www.ftc.gov/business-guidance/resources/native-advertising-guide-businesses

---

# 21. Vendor Interaction Policy

## Why This Matters

As Platform Signal grows, vendors will offer:

- Briefings
- Demo environments
- Free licenses
- Early access
- Conference travel
- Quotes
- Product review access

Without policy, access subtly shapes coverage.

SPJ’s independence principles are useful even for a technical publication.

## Recommended Vendor Rules

Platform Signal may accept:

- Briefings
- Demo access
- Time-limited evaluation licenses
- Documentation
- Technical interviews

with disclosure when material.

Platform Signal should not promise:

- Positive coverage
- Publication
- Specific conclusion
- Pre-publication approval

## Pre-Publication Vendor Fact Check

A useful distinction:

Vendors may be allowed to verify narrowly defined factual details:

> “Does version 4.2 support feature X?”

They should **not** review editorial conclusions or the complete review.

## Gift Policy

Define a threshold.

Safest policy:

- Avoid material gifts
- Disclose meaningful free access/travel
- Prefer paying normal costs where practical

## Vendor Response

For critical coverage, give the vendor an opportunity to provide factual response when appropriate.

---

# 22. Security & Responsible Disclosure

## Why This Matters

Labs involving Kubernetes, MCP, agents, identity, and tool execution may uncover:

- Vulnerabilities
- Unsafe defaults
- Credential exposure
- Authorization bypasses
- Data leakage

Immediate public disclosure can harm users.

CISA and CERT/CC both provide coordinated vulnerability disclosure guidance.

## Recommended Responsible Disclosure Workflow

```text
Potential vulnerability discovered
        ↓
Validate privately
        ↓
Assess severity / exposure
        ↓
Identify maintainer/vendor
        ↓
Private notification
        ↓
Coordinate remediation timeline
        ↓
Vendor fix/advisory when possible
        ↓
Publish responsible technical analysis
```

## Create a Public Policy

`/responsible-disclosure`

Include:

- Contact method
- Encryption option if available
- Safe-harbor language for reports to Platform Signal itself
- Disclosure philosophy

## Internal Policy

If Platform Signal discovers someone else’s vulnerability:

- Do not publish working exploit details immediately
- Preserve evidence privately
- Contact the affected project/vendor
- Consider CERT/CC coordination if multi-vendor or unresponsive
- Coordinate publication timing

## Sources

- CISA Vulnerability Disclosure Policy Template:  
  https://www.cisa.gov/vulnerability-disclosure-policy-template
- CERT Guide to Coordinated Vulnerability Disclosure:  
  https://vuls.cert.org/confluence/display/CVD

---

# 23. Legal, Copyright & Content Rights

## Why This Matters

Technical publishing regularly uses:

- Screenshots
- Vendor logos
- Code
- Documentation excerpts
- Research charts
- Paper figures
- Open-source diagrams
- Community posts

Ownership and reuse rules vary.

The U.S. Copyright Office explains that copyright protection generally arises when an original work is fixed. Fair use can permit limited portions for commentary, criticism, news reporting, and scholarship, but there is no universal permitted word count or percentage.

Creative Commons recommends the TASL model:

- Title
- Author
- Source
- License

for licensed works.

## Recommended Asset Policy

Every third-party visual asset should have metadata:

```yaml
source:
creator:
license:
permission_basis:
attribution:
used_in:
```

## Preferred Visual Policy

1. Original Platform Signal diagrams
2. Platform Signal-generated charts from licensed/public data
3. CC-licensed assets with correct attribution
4. Limited screenshots for genuine commentary where appropriate
5. Vendor media-kit assets under stated terms

Avoid scraping arbitrary images from search.

## Code

Code licenses matter.

When reproducing meaningful code from open-source projects:

- Check license
- Attribute
- Prefer linking when a large excerpt is unnecessary

## Research Figures

Prefer:

- Recreating a chart from data when licensing allows
- Linking to paper
- Small necessary excerpts with proper context

Do not assume “academic” means free to republish.

## AI-Generated Assets

Maintain provenance.

The U.S. Copyright Office continues to publish guidance on copyright and AI-generated works; this remains an evolving area.

## Sources

- U.S. Copyright Office Fair Use FAQ:  
  https://www.copyright.gov/help/faq/faq-fairuse.html
- U.S. Copyright Office — What Is Copyright?:  
  https://www.copyright.gov/what-is-copyright/
- U.S. Copyright Office — Copyright and AI:  
  https://www.copyright.gov/ai/
- Creative Commons attribution guidance:  
  https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution

---

# 24. Backups & Content Ownership

## Why This Matters

The website application can be rebuilt.

The unique content corpus is much harder to replace.

CISA describes the 3-2-1 backup rule:

- 3 copies
- 2 media/storage types
- 1 off-site copy

CISA and NIST also emphasize testing backups and restoration rather than merely creating backups.

GitHub documents repository mirror clones for backups.

## Recommended Platform Signal Strategy

### Primary

GitHub repository.

### Secondary

Mirror repository on a separate provider or independent storage.

Example:

```text
GitHub
  ↓ scheduled mirror
Gitea / GitLab / private backup remote
```

### Third

Periodic compressed/offline archive.

Include:

- Git history
- MDX
- Images
- Diagrams
- Research ledgers
- Editorial policies
- Newsletter exports where allowed
- Configuration

## Schedule

### Daily

Remote Git history exists through normal pushes.

### Weekly

Automated mirror.

### Monthly

Immutable/offline archive.

### Quarterly

Restore test.

## Restore Test

A backup is not validated until you can rebuild:

```text
Repository
   ↓
Install
   ↓
Build
   ↓
Render content
   ↓
Verify assets
```

## Content Ownership Principle

Avoid architectures where the canonical article content exists only in a proprietary CMS.

Markdown/Git remains the source of truth.

## Sources

- CISA Back Up Business Data:  
  https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/back-up-business-data
- NIST — Protecting Data from Ransomware/Data Loss:  
  https://csrc.nist.gov/pubs/other/2020/04/24/protecting-data-from-ransomware-and-other-data-los/final
- GitHub — Backing Up a Repository:  
  https://docs.github.com/en/repositories/archiving-a-github-repository/backing-up-a-repository

---

# 25. Reproducibility as a Publication Differentiator

## Why This Matters

Most technical blogs show that something worked for the author.

Platform Signal Labs should aim to show enough information for someone else to determine whether it works for them.

ACM’s artifact-review model distinguishes concepts such as artifact availability, evaluation, and reproduced/replicated results. NIST research on computational reproducibility emphasizes that versions, dependencies, software environments, hardware, and runtime conditions can materially affect reproducibility.

## Platform Signal Reproducibility Levels

### Level 0 — Narrative

Article describes experience only.

No reproducibility claim.

### Level 1 — Environment Documented

Include:

```text
OS
Kubernetes
Distribution
Hardware
Software versions
Date tested
```

### Level 2 — Artifacts Available

Provide:

- Manifests
- Scripts
- Code
- Configuration
- Sample data where permitted

### Level 3 — Reproduction Instructions

A reader can recreate environment and rerun.

### Level 4 — Independently Reproduced

Someone other than original author follows instructions and verifies result.

## Platform Signal Lab Badge Concept

```text
ENVIRONMENT DOCUMENTED
ARTIFACTS AVAILABLE
CONFIGURATION VALIDATED
RESULTS REPRODUCED
```

Only award what was genuinely completed.

## Required Lab Metadata

```yaml
lab:
  id:
  tested_at:
  environment:
    os:
    kubernetes:
    distribution:
    hardware:
    gpu:
  software:
    - name:
      version:
  artifacts:
    repository:
    commit:
  verification:
    configuration_validated:
    independently_reproduced:
```

## Reproducibility Checklist

- Pin versions
- Record commit SHAs
- Record hardware
- Record input data
- Record commands
- Save logs
- Explain expected output
- Document deviations
- Document failures
- Include limitations
- Avoid cherry-picking results

## Long-Term Opportunity

A strong reproducibility standard could become one of Platform Signal’s most valuable brand signals.

Instead of:

> “We tried this.”

Platform Signal can say:

> **“We tested this under these conditions, here are the artifacts, and here is exactly what happened.”**

## Sources

- ACM Artifact Review & Badging:  
  https://reviewers.acm.org/training-course/artifact-review-and-badging
- ACM Software & Data Artifacts:  
  https://www.acm.org/publications/artifacts
- NIST Numerical Reproducibility:  
  https://www.nist.gov/programs-projects/numerical-reproducibility

---

# Recommended Integrated Editorial Architecture

With all 25 areas in place, the publication workflow should look like:

```text
                        ┌───────────────────────┐
                        │  CONTENT INTELLIGENCE │
                        │ Trends / releases /   │
                        │ search / research     │
                        └──────────┬────────────┘
                                   │
                                   ▼
                        ┌───────────────────────┐
                        │    MANAGING EDITOR    │
                        │ prioritize / assign   │
                        └──────────┬────────────┘
                                   │
                                   ▼
                        ┌───────────────────────┐
                        │     ARTICLE BRIEF     │
                        └──────────┬────────────┘
                                   │
                                   ▼
             ┌────────────────────────────────────────┐
             │              AUTHOR PERSONA             │
             │ Marcus / Maya / Elias / Nia             │
             └───────────────────┬────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ TECHNICAL RESEARCH      │
                    │ EDITOR                  │
                    │ evidence / versions /   │
                    │ production sanity       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ AUTHOR REVISION         │
                    └────────────┬────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
                ▼                                 ▼
       ┌───────────────────┐            ┌────────────────────┐
       │ CODE / ARTIFACT   │            │ EDITORIAL QUALITY  │
       │ VALIDATION        │            │ & STYLE REVIEW     │
       └─────────┬─────────┘            └──────────┬─────────┘
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  HUMAN APPROVAL  │
                         └────────┬─────────┘
                                  │
                                  ▼
                             PUBLISH
                                  │
               ┌──────────────────┼─────────────────┐
               │                  │                 │
               ▼                  ▼                 ▼
            SEARCH            NEWSLETTER         SOCIAL
               │                  │                 │
               └──────────────────┼─────────────────┘
                                  │
                                  ▼
                            ANALYTICS
                                  │
                                  ▼
                       CONTENT INTELLIGENCE
```

---

# Recommended Repository Additions

```text
platform-signal/
├── docs/
│   ├── editorial/
│   │   ├── EDITORIAL-STANDARDS.md
│   │   ├── CORRECTIONS-POLICY.md
│   │   ├── SPONSORSHIP-POLICY.md
│   │   ├── VENDOR-INTERACTION-POLICY.md
│   │   ├── RESPONSIBLE-DISCLOSURE.md
│   │   ├── CONTENT-RIGHTS-POLICY.md
│   │   └── AI-EDITORIAL-PROCESS.md
│   │
│   ├── agents/
│   │   ├── MANAGING-EDITOR.md          # The Desk (from EDITORIAL-AND-TOPIC-AGENTS)
│   │   ├── CONTENT-INTELLIGENCE.md     # The Radar (from EDITORIAL-AND-TOPIC-AGENTS)
│   │   ├── TECHNICAL-RESEARCH-EDITOR.md
│   │   └── DISTRIBUTION-EDITOR.md
│   │
│   └── standards/
│       ├── ARTICLE-BRIEF.md
│       ├── CONTENT-TYPES.md
│       ├── QUALITY-SCORE.md
│       ├── CODE-VALIDATION.md
│       ├── DIAGRAM-STANDARD.md
│       └── LAB-REPRODUCIBILITY.md
│
├── editorial/
│   ├── opportunities/          # PS-O-NNNN.yml  (Radar)
│   ├── briefs/                 # PS-NNNNNN.yml  (Desk)
│   ├── calendar.yml
│   ├── clusters.yml
│   ├── watchlist.yml
│   ├── sources.yml
│   └── performance/
│
└── content/
    └── articles/
        └── <slug>/
            ├── brief.yml
            ├── index.mdx
            ├── evidence.yml
            ├── code/
            └── diagrams/
```

---

# Recommended Article Metadata Schema

```yaml
id: PS-000001

title:
slug:
description:

contentType:
authorPersona:

status:
editorialPriority:

publishedAt:
updatedAt:
lastReviewedAt:
reviewAfter:

category:
tags:
concepts:

technologyVersions:

difficulty:
readingTime:

seo:
  title:
  description:
  primaryQuery:
  searchIntent:

research:
  editorStatus:
  confidence:
  evidenceLedger:

codeVerification:
  status:
  testedAt:

reproducibility:
  level:

corrections: []

relationships:
  relatedArticles: []
  series:
  sources: []
  diagrams: []

sponsorship:
  sponsored: false
  affiliateLinks: false
```

---

# Priority Roadmap

## Priority 0 — Before Launch Article Production

Complete these before generating the initial 15 articles at scale:

1. Editorial Standards
2. Managing Editor
3. Article Brief
4. Content Types
5. Technical Research Editor
6. Evidence Ledger
7. Human Approval Gate

## Priority 1 — During Initial 15 Articles

Implement:

8. Source Library
9. Citation UX
10. Freshness/version metadata
11. Article IDs
12. Diagram standard
13. Code verification
14. Quality score

## Priority 2 — Before Public Launch

Implement:

15. Corrections policy
16. Sponsorship policy
17. Vendor policy
18. Responsible disclosure
19. Content rights policy
20. Backup strategy
21. Analytics model

## Priority 3 — First 90 Days

Implement/refine:

22. Content Intelligence automation
23. Distribution Agent
24. Newsletter as product
25. Knowledge graph + reproducibility maturity

---

# Final Recommendation

Platform Signal’s opportunity is not simply to produce more accurate AI-assisted content.

The stronger position is:

> **A technical publication where every important claim is sourced, every major recommendation is challenged, experiments are reproducible, versions are explicit, corrections are visible, and readers can tell the difference between fact, analysis, and prediction.**

That is much harder to replicate than a publishing schedule or attractive Next.js design.

The operating principle should remain:

> **High signal. Low noise. Evidence always.**
