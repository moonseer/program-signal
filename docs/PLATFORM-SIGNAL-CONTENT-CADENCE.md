# Platform Signal — Content Cadence & Publishing Strategy

**Version:** 1.1  
**Purpose:** Define the recommended launch inventory, ongoing publishing cadence, persona rhythm, recurring editorial formats, 90-day growth target, and content refresh model for Platform Signal.

Control-layer operating cadence (Monday Radar + Desk) is specified in [`PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`](./PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md). This document remains canonical for *what* to publish and how often; that document is canonical for *how topics are chosen and approved*.

---

# 1. Day-One Launch Target

Platform Signal should launch with:

> **12–15 articles on day one**

This is enough content for the site to feel established, support internal linking, and give readers multiple paths to explore.

Avoid launching with only 3–5 articles because the publication may feel unfinished.

Avoid waiting for 30–40 articles because that delays real-world feedback, indexing, and audience learning.

The priority should be:

- Strong topic clusters
- Clear internal linking
- Distinct author voices
- High-value technical depth
- Excellent presentation
- Original analysis

---

# 2. Recommended Day-One Content Mix

A strong launch mix:

| Cluster | Articles |
|---|---:|
| AI Agents / Agent Harness | 4 |
| Kubernetes + AI Infrastructure | 3 |
| MCP / Agent Protocols | 2 |
| Platform Engineering / SRE | 2 |
| FDE / Engineering Growth | 2 |
| Current / “The Signal” Analysis | 2 |
| **Total** | **15** |

The goal is not to publish 15 unrelated posts.

The goal is to launch with several tightly connected content clusters.

---

# 3. Recommended Launch Articles

1. **What Is an AI Agent Harness?**
2. **The Anatomy of a Production AI Agent**
3. **Agent Harness vs Agent Framework vs MCP**
4. **What Actually Belongs Inside an Agent Harness?**
5. **Kubernetes for AI: A Production Architecture Guide**
6. **Kubernetes GPU Scheduling and DRA Explained**
7. **Building an Internal AI Platform on Kubernetes**
8. **MCP for Platform Engineers**
9. **How to Run MCP Servers Safely on Kubernetes**
10. **What Is Agentic Platform Engineering?**
11. **Observability for AI Agents**
12. **What Is a Forward Deployed Engineer?**
13. **FDE vs Platform Engineer vs Solutions Architect**
14. **Why Everyone Suddenly Wants an MCP Gateway**
15. **The State of Platform Engineering in the Age of AI Agents**

This launch inventory gives readers several logical next reads from every major article.

---

# 4. Ongoing Publishing Cadence

Recommended baseline:

> **2 new articles per week**

Suggested rhythm:

### Tuesday
**Deep technical article**

Usually authored in the Marcus or Maya editorial voice.

Examples:

- MCP Security Architecture for Kubernetes
- Kubernetes DRA: Production Readiness Guide
- Designing an Enterprise Agent Platform

### Thursday
**Practical, current, or field-oriented article**

Usually authored in the Elias or Nia editorial voice.

Examples:

- Why Everyone Suddenly Wants an MCP Gateway
- From AI POC to Production
- What Changed in Kubernetes This Week

### Friday
**The Signal weekly briefing / newsletter**

A curated summary of important developments.

---

# 5. Recommended Monthly Article Mix

Not every article should have the same length or format.

Recommended monthly mix:

| Type | Monthly Target | Typical Length |
|---|---:|---:|
| Architecture Deep Dive | 2 | 2,500–4,500 words |
| Operator / Production Guide | 2 | 1,800–3,000 words |
| The Signal / Emerging Tech | 2 | 700–1,500 words |
| Field / FDE Article | 1 | 1,200–2,000 words |
| Engineering Lab | 1 | 2,000–4,000 words |
| **Total** | **8 substantial articles** | |

This produces variation in depth and reading time.

---

# 6. Persona Publishing Cadence

## Maya Chen — The Architect

**Target:** 2 articles per month

Typical content:

- Architecture deep dives
- Reference architectures
- Agent platform design
- AI infrastructure
- Platform control planes
- Distributed systems

These are major authority-building pieces.

Examples:

- Designing an Enterprise Agent Platform
- Kubernetes as an AI Runtime
- The Emerging AI Platform Control Plane

---

## Marcus Reed — The Operator

**Target:** 2 articles per month

Typical content:

- Production operations
- Failure modes
- Observability
- SRE
- Kubernetes operations
- Incident response
- Reliability

These articles should become strong evergreen search content.

Examples:

- What Happens When Your MCP Server Fails?
- Kubernetes DRA: What Platform Teams Need to Monitor
- Five Ways Agentic Incident Response Can Go Wrong

---

## Elias Voss — The Scout

**Target:** 2–3 articles per month

Typical content:

- Emerging technologies
- New releases
- Research
- Standards
- Ecosystem movement
- Industry changes

These articles are usually shorter and more current.

Examples:

- Why This New Kubernetes Change Matters
- Three AI Infrastructure Projects Worth Watching
- Agent Harnesses Are Becoming a Software Category

---

## Nia Brooks — The Field Engineer

**Target:** 1–2 articles per month

Typical content:

- FDE
- Implementation
- Technical discovery
- POCs
- Career development
- Platform adoption
- Build vs buy

Examples:

- From AI POC to Production
- They Asked for Kubernetes. They Didn’t Need Kubernetes.
- FDE vs Solutions Architect vs Platform Engineer

---

# 7. Weekly Recurring Feature — The Signal

Create a recurring Friday briefing:

# The Signal — Weekly Brief

Recommended structure:

```text
THE SIGNAL / DATE

01 Kubernetes
What changed

02 Agent Infrastructure
What changed

03 Platform Engineering
What changed

04 Research Worth Reading
What caught our attention

05 What We’re Watching
One emerging trend
```

Recommended length:

- 3–5 important developments
- Short commentary
- Strong links to deeper Platform Signal articles where relevant

Purpose:

- Give readers a reason to return weekly
- Provide a natural newsletter format
- Keep the publication current
- Build editorial trust

---

# 8. Monthly Recurring Feature — Platform Signal Lab

Publish one ambitious original engineering piece each month.

Examples:

- Can an AI Agent Diagnose a Broken Kubernetes Cluster?
- Running MCP Servers on Kubernetes: Failure Testing
- Comparing GPU Scheduling Approaches
- Tracing a Multi-Agent Workflow with OpenTelemetry
- Evaluating Agent Recovery After Tool Failure

Each Lab should include:

- Hypothesis
- Environment
- Architecture
- Test plan
- Implementation
- Logs / screenshots
- Results
- Failures
- Conclusions
- Reproducibility notes
- Repository link where appropriate

Labs should be designed for backlinks, community sharing, and technical credibility.

---

# 9. Recommended Weekly Rhythm

```text
TUESDAY
Deep Dive

THURSDAY
Analysis / Field Note

FRIDAY
The Signal
```

This cadence provides:

- One substantial evergreen piece
- One faster practical/current piece
- One recurring editorial brief

It is frequent enough to build momentum without turning Platform Signal into a content factory.

---

# 9a. Monday Control-Layer Rhythm

Before the Tuesday deep dive, run the two internal operating reports. Neither is a public article.

```text
MONDAY
The Radar — Opportunity Radar (top 5, watch, declining, refresh)
The Desk  — Editorial Desk (portfolio health, this week, risks, next priorities)

TUESDAY
Deep Dive

THURSDAY
Analysis / Field Note

FRIDAY
The Signal
```

Radar proposes. Desk accepts, reframes, holds, merges, watches, or rejects. Authors do not start from a blank “write about X” prompt.

Launch inventory (the 15) should still be seeded as opportunity cards and briefs so the same contract is used from day one.

---

# 10. First 90 Days

Recommended publishing target:

## Launch

**15 articles**

## Month 1

Add approximately **8 articles**

Running total:

**~23 articles**

## Month 2

Add approximately **8 articles**

Running total:

**~31 articles**

## Month 3

Add approximately **8 articles**

Running total:

**~39–40 articles**

Target after 90 days:

> **Approximately 40 high-quality articles**

This is enough content to begin identifying meaningful traffic patterns and topic winners.

---

# 11. Six-Month Target

At approximately 8 substantial articles per month after launch:

Expected six-month corpus:

> **Approximately 60–70 strong articles**

The exact number matters less than maintaining:

- Technical quality
- Strong visual presentation
- Distinct author voices
- Good internal linking
- Useful diagrams
- Original analysis
- Clear recommendations

---

# 12. Measure Before Scaling

Once the site reaches roughly 30–40 articles, use data to adjust publishing priorities.

Review:

- Search impressions
- Search clicks
- CTR
- Ranking queries
- Newsletter signups
- Visitor-to-subscriber conversion
- Time on page
- Returning readers
- Backlinks
- LinkedIn engagement
- Reddit / Hacker News engagement
- Internal search queries
- Related-article clickthrough

Example:

```text
Agent Harness     █████████████████  Strong
MCP               ██████████████     Strong
Kubernetes AI     █████████████      Strong
Generic DevOps    █████              Weak
Career / FDE      ███████            Medium
```

If Agent Harness and MCP consistently outperform other categories, increase publishing around those clusters.

Do not keep topic distribution static when audience behavior shows a clear preference.

---

# 13. Content Cluster Expansion

When a topic performs well, build supporting articles around it.

Example:

```text
AI Agent Harness — Pillar Article
        │
        ├── Agent Harness vs Framework
        ├── Context Engineering
        ├── Agent Memory
        ├── Tool Design
        ├── Harness Security
        ├── Agent Observability
        └── Kubernetes Runtime
```

This improves:

- Reader discovery
- SEO authority
- Internal linking
- Time on site
- Newsletter conversion
- Topic ownership

---

# 14. Content Refresh Cadence

Technical content decays quickly.

Recommended internal metadata:

```yaml
refreshCycle: 90
```

for rapidly changing subjects such as:

- MCP
- Agent frameworks
- Agent harness tooling
- Kubernetes AI capabilities
- Model serving
- AI agent observability
- LLM infrastructure

Use:

```yaml
refreshCycle: 180
```

for slower-moving topics such as:

- Platform engineering
- SRE fundamentals
- Architecture patterns
- FDE
- Engineering leadership
- Career guidance

---

# 15. Content Refresh Triggers

Refresh an article when:

- A major Kubernetes release changes relevant behavior
- MCP specifications materially change
- A project changes architecture
- A major vendor integration changes
- Search traffic declines significantly
- Screenshots become outdated
- Commands or manifests stop working
- Important external references break
- A better implementation pattern emerges
- Reader feedback exposes missing context

---

# 16. Publishing Model

Avoid this:

```text
Publish
   ↓
Publish
   ↓
Publish
   ↓
Publish
```

Use this:

```text
            RESEARCH
               ↓
             WRITE
               ↓
            PUBLISH
               ↓
           DISTRIBUTE
               ↓
            MEASURE
               ↓
             LEARN
               ↓
      ┌────────┴────────┐
      │                 │
    UPDATE          NEW ARTICLE
      │                 │
      └────────┬────────┘
               ↓
            GROWTH
```

The content operation should continuously learn from what readers actually use.

---

# 17. Distribution Should Follow Publication

Each article should not merely be published and forgotten.

Recommended distribution channels:

- LinkedIn
- Platform Signal newsletter
- Relevant Reddit communities
- Hacker News for suitable original technical work
- Dev.to or selective cross-posting
- Kubernetes / CNCF communities
- Platform engineering communities
- AI infrastructure communities
- Professional network

Distribution should be tailored to the article rather than automated indiscriminately.

---

# 18. Quality Guardrail

Platform Signal should favor:

> **8 excellent articles per month**

over:

> **25 shallow articles per month**

The publication’s differentiation should come from:

- Technical accuracy
- Original thinking
- Strong diagrams
- Useful examples
- Production considerations
- Clear recommendations
- Good sourcing
- Distinct editorial voices

Publishing volume should never undermine those qualities.

---

# 19. Cadence Summary

| Period | Target |
|---|---:|
| **Day 1** | **12–15 articles** |
| Weekly (Monday) | **Opportunity Radar + Editorial Desk reports** (internal) |
| Weekly | **2 new articles** |
| Weekly | **1 Signal briefing / newsletter** |
| Monthly | **1 Platform Signal Lab** |
| Monthly | **~8 substantial articles** |
| Day 30 | **~23 articles** |
| Day 60 | **~31 articles** |
| Day 90 | **~39–40 articles** |
| Month 6 | **~60–70 strong articles** |
| Content refresh | **90–180 days depending on topic** |

---

# 20. Recommended Operating Principle

The goal is not maximum publishing frequency.

The goal is:

> **Enough consistency to build authority, enough depth to earn trust, and enough measurement to learn what readers actually value.**

Platform Signal should grow through **high signal, not high volume**.
