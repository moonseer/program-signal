# Platform Signal — Agent & Persona Architecture

**Version:** 1.0  
**Purpose:** Define how Platform Signal should implement its author personas and editorial agents, including orchestration, model routing, permissions, structured outputs, validation, evaluation, versioning, and publishing controls.  
**Tracked in:** [`BACKLOG.md`](./BACKLOG.md) epics E02 (S02.08), E37, E39.

## Core Recommendation

Platform Signal should distinguish clearly between **personas** and **agents**:

> **Personas = versioned writing configurations**  
> **Agents = specialized workers with tools, state, permissions, and structured outputs**  
> **Workflow = deterministic orchestration with explicit approval gates**

This gives the publication agentic leverage without creating an uncontrolled swarm.


---

## 1. Personas Should Not Be Separate Autonomous Agents

Marcus, Maya, Elias, and Nia should initially use one shared **Author Agent** with different persona packages.

```text
agents/
└── author/
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

The author context is assembled from:

```text
BASE AUTHOR INSTRUCTIONS
        +
PLATFORM SIGNAL EDITORIAL STANDARDS
        +
PERSONA PACKAGE
        +
CONTENT TYPE
        +
ARTICLE BRIEF
        +
APPROVED RESEARCH / EVIDENCE
        =
ARTICLE CONTEXT
```

Do not build four separate agent runtimes unless later evidence shows a real operational need.


---

## 2. Do Not Fine-Tune Four Persona Models Initially

Use prompt/context engineering first.

Example persona configuration:

```yaml
persona: maya
role: architect

voice:
  analytical: very_high
  narrative: low
  opinionated: medium
  architectural_models: very_high

preferred_elements:
  - architecture_diagrams
  - layered_models
  - decision_matrices
  - reference_architectures

avoid:
  - hype
  - unsupported_predictions
  - generic_listicles
  - fake first-person experience
```

Version personas like software:

```text
maya-v1.0
maya-v1.1
maya-v2.0
```

This makes editorial behavior auditable and regression-testable.


---

## 3. Recommended Technical Stack

```text
LANGUAGE
Python

AGENT SDK
PydanticAI

WORKFLOW ORCHESTRATION
LangGraph

MODEL GATEWAY
LiteLLM

MODEL PROVIDERS
Multiple / interchangeable

CONTENT SOURCE OF TRUTH
Git + MDX + YAML

RUNTIME STATE
PostgreSQL

ARTICLE ARTIFACTS
Git repository

SEARCH / CORPUS
Static search + PostgreSQL initially
pgvector later

OBSERVABILITY
Structured logs + agent traces

CODE EXECUTION
Isolated Docker sandbox

PUBLISHING
Git PR → human approval → merge

SITE
Next.js / Vercel
```

The key architectural goal is provider independence and explicit workflow state.


---

## 4. Why Use Typed Agents

Use typed schemas for agent communication.

Examples:

- `OpportunityCard`
- `EditorialDecision`
- `ArticleBrief`
- `EvidenceReview`
- `ClaimReview`
- `VerificationReport`

Example:

```python
class OpportunityCard(BaseModel):
    opportunity_id: str
    topic: str
    score: int
    why_now: str
    audience: list[str]
    content_gap: str
    suggested_persona: str
    confidence: str
```

The Radar should return this object, not an unstructured paragraph of ideas.

Structured outputs make the system easier to validate, store, retry, test, and audit.


---

## 5. Workflow Orchestration

The newsroom is primarily a workflow:

```text
TOPIC
  ↓
RADAR
  ↓
DESK
  ↓
ARTICLE BRIEF
  ↓
AUTHOR
  ↓
EVIDENCE EDITOR
  ↓
REVISION
  ↓
CODE / ARTIFACT VALIDATION
  ↓
DESK FINAL REVIEW
  ↓
HUMAN APPROVAL
  ↓
PUBLISH
  ↓
ANALYTICS
  ↓
RADAR
```

Use explicit conditional routing:

```text
Draft
  ↓
Evidence Editor
  ├── PASS ────────────────┐
  ├── CHANGES → Author ────┤
  └── HOLD → Human Review ─┤
                            ↓
                           Desk
```

Human approval should remain a hard interruption before publish.


---

## 6. Model Routing by Capability, Not Persona

Do not create `marcus-model`, `maya-model`, etc.

Create logical model classes:

```text
research
reasoning
writer
fast
local
```

Example routing:

| Role | Model Class |
|---|---|
| Radar | Research |
| Evidence Editor | Research |
| Desk | Reasoning |
| Maya | Writer / Reasoning |
| Marcus | Writer / Reasoning |
| Elias | Writer |
| Nia | Writer |
| Metadata / SEO extraction | Fast |
| Distribution | Fast / Writer |

Example aliases:

```yaml
research:
  primary: strongest_reasoning_model
  fallback: strong_reasoning_model

writer:
  primary: best_long_form_model
  fallback: strong_general_model

fast:
  primary: inexpensive_model
  fallback: local_model
```

LiteLLM can sit between the workflow and model providers so provider changes do not affect the editorial architecture.


---

## 7. Agent Tool and Permission Boundaries

### Radar / Content Intelligence

Tools:

```text
Web search
Google Trends
Search Console
RSS
GitHub releases
Research search
Existing article search
Topic database
Analytics
```

Permissions:

```text
READ internet
READ corpus
READ analytics
WRITE opportunities

NO publishing
NO article editing
NO evidence override
```

### Desk / Managing Editor

Tools:

```text
Article inventory
Editorial calendar
Opportunity database
Performance analytics
Persona definitions
Editorial standards
Existing article search
Research-review status
```

Permissions:

```text
READ publication
WRITE briefs
WRITE assignments
WRITE editorial decisions

NO evidence override
NO autonomous publishing
```

### Author Agent

Inputs:

```text
Article brief
Persona package
Approved evidence pack
Existing Platform Signal content
Style guide
Diagram requirements
Content-type rules
```

Recommendation: limit unrestricted web access initially. If the author needs more evidence, it should submit a research request to the Evidence Editor.

### Technical Research Editor

Tools:

```text
Web research
Official documentation
Specifications
Research papers
Whitepapers
Vendor docs
GitHub releases
Draft
Evidence ledger
Version information
```

Permissions:

```text
READ sources
WRITE claim reviews
WRITE evidence ledger
REQUEST corrections

NO publishing
NO changing editorial policy
```


---

## 8. Code Verification Should Be Deterministic

Do not ask an LLM to decide whether code is syntactically valid when a deterministic tool can test it.

```text
YAML
 ↓
Parser
 ↓
Schema validation
 ↓
kubectl dry-run
```

```text
Shell
 ↓
ShellCheck
```

```text
Python
 ↓
Compile
 ↓
Tests
```

```text
JSON
 ↓
Parser
 ↓
Schema validation
```

The LLM can explain failures. The validation tool determines pass/fail.


---

## 9. Article Artifact Structure

Treat every article as a complete editorial package.

```text
articles/
└── PS-000027-agent-identity/
    ├── opportunity.yml
    ├── brief.yml
    ├── draft.mdx
    ├── article.mdx
    ├── evidence.yml
    ├── editorial-review.yml
    ├── verification.yml
    ├── sources.bib
    ├── diagrams/
    │   ├── architecture.mmd
    │   └── architecture.svg
    └── code/
        ├── example.yaml
        └── test.sh
```

This makes the article:

- Auditable
- Reproducible
- Refreshable
- Versionable
- Suitable for future search and RAG workflows


---

## 10. Keep Context Layers Separate

Do not create one giant system prompt containing personality, facts, policy, evidence, and workflow state.

Keep these independent:

```text
PERSONA
How the author communicates

EDITORIAL POLICY
How Platform Signal operates

ARTICLE BRIEF
What the story must answer

EVIDENCE PACK
What is currently supported

ARTICLE STATE
What has already been drafted

MODEL CONFIG
Which capability/model is being used
```

This improves maintainability, evaluation, prompt versioning, and persona consistency.


---

## 11. Persona Package Files

Each author should have:

```text
persona.md
voice.md
patterns.md
examples.md
anti-patterns.md
review-rubric.md
```

### `persona.md`
Defines identity, audience, intellectual perspective, and topic ownership.

### `voice.md`
Defines sentence rhythm, vocabulary, tone, formality, point of view, and level of opinion.

### `patterns.md`
Defines preferred article structure, diagram style, table usage, callouts, and conclusion patterns.

### `examples.md`
Contains 5–10 strong example passages.

### `anti-patterns.md`
Defines behaviors the persona must avoid.

### `review-rubric.md`
Defines persona-specific self-review questions.


---

## 12. Persona Review Rubrics

### Marcus — The Operator

Ask:

```text
Did I explain failure modes?
Did I explain observability?
Did I explain recovery?
Did I discuss upgrades?
Did I identify blast radius?
Did I explain operational ownership?
```

Avoid:

- Fake incidents
- Fake first-person production experience
- Casual “production-ready” claims
- Hype
- Ignoring operational burden

### Maya — The Architect

Ask:

```text
Did I define system boundaries?
Did I separate control and data planes?
Did I identify component responsibilities?
Did I explain tradeoffs?
Did I create a reusable conceptual model?
Did I distinguish protocol from implementation?
```

Avoid:

- Conflating architectural layers
- Undefined terminology
- Treating one vendor architecture as universal
- Presenting speculation as consensus

### Elias — The Scout

Ask:

```text
What actually changed?
Why now?
Is it technically meaningful?
Who should care?
What supports the trend?
What should we watch next?
```

Avoid:

- Treating hype as adoption
- Treating one release as a trend
- Inventing search demand
- Clickbait
- Calling emerging tech mature without evidence

### Nia — The Field Engineer

Ask:

```text
What problem are we solving?
Who is the user?
What constraints are real?
Are we adding unnecessary complexity?
Who owns this afterward?
What does success look like?
```

Avoid:

- Starting with technology before the problem
- Forcing Kubernetes or AI into every solution
- Ignoring organizational constraints
- Ignoring implementation cost


---

## 13. Author Drafting Loop

Do not generate complete articles in one pass.

```text
BRIEF
  ↓
OUTLINE
  ↓
DESK OUTLINE REVIEW
  ↓
DRAFT
  ↓
PERSONA SELF-REVIEW
  ↓
EVIDENCE REVIEW
  ↓
REVISION
  ↓
DETERMINISTIC VALIDATION
  ↓
EDITORIAL REVIEW
  ↓
HUMAN APPROVAL
```

This is the preferred production loop for substantial content.


---

## 14. Structured Outputs Everywhere Except Article Prose

Recommended agent contracts:

```text
Radar
→ OpportunityCard

Desk
→ EditorialDecision
→ ArticleBrief

Evidence
→ EvidenceReview
→ Claim[]

Verification
→ VerificationReport

Author
→ MDX article / outline
```

This keeps prose generation limited to the role where prose is actually the product.


---

## 15. Agent Evaluation Suite

Create prompt regression tests before trusting the system.

```text
evals/
├── radar/
├── desk/
├── evidence/
├── marcus/
├── maya/
├── elias/
└── nia/
```

Examples:

### Marcus

```text
INPUT:
A new Kubernetes feature is described only
by a vendor press release.

EXPECTED:
Do not call it production-ready.
Request stronger evidence.
```

### Maya

```text
INPUT:
An architecture conflates an MCP server
with the agent runtime.

EXPECTED:
Separate the components and responsibilities.
```

### Radar

```text
INPUT:
A high-search-volume consumer AI topic unrelated
to Platform Signal's mission.

EXPECTED:
Low Platform Signal fit.
Do not recommend.
```

### Desk

```text
INPUT:
A proposal overlaps 85% with an existing article.

EXPECTED:
MERGE or REJECT.
```


---

## 16. Version Everything

Every workflow run should capture:

```yaml
workflow_version: 1.2.0

agents:
  radar: 1.4.0
  desk: 1.2.3
  evidence: 1.5.1
  author: 1.1.0

persona:
  name: maya
  version: 1.3.0

model:
  alias: writer

article:
  id: PS-000027
```

This lets you correlate prompt/model changes with quality, performance, cost, and revision rate.


---

## 17. Tag Every Model Request

Attach:

```text
article_id
agent
persona
workflow_stage
content_type
environment
model_alias
```

Example:

```yaml
tags:
  - platform-signal
  - PS-000027
  - author
  - maya
  - deep-dive
```

This enables later analysis of:

- Cost by article
- Cost by persona
- Cost by agent
- Latency
- Model failure rates
- Revision cost
- Research-to-writing ratio


---

## 18. Human Approval Is a Hard Gate

Required publication state:

```text
Technical Research Review: PASS
Managing Editor: APPROVED
Automated Checks: PASS
Human Editor: APPROVED
```

Only then:

```text
PUBLISH
```

Human review should ask:

- Does this genuinely add value?
- Would I defend the recommendation publicly?
- Is anything plausible but misleading?
- Are caveats sufficient?
- Is the persona voice intact?
- Does it sound like Platform Signal?
- Is the visual presentation strong?
- Would a serious engineer learn something useful?


---

## 19. Recommended Agent Permissions Matrix

| Role | Internet | Corpus | Analytics | Write Brief | Write Article | Verify Evidence | Shell | Publish |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Radar | Yes | Yes | Yes | No | No | No | No | No |
| Desk | Limited | Yes | Yes | Yes | No | No | No | No |
| Author | Limited | Yes | No | No | Yes | No | No | No |
| Evidence Editor | Yes | Yes | Limited | No | No | Yes | Limited | No |
| Verification Service | No | Article artifacts | No | No | No | Deterministic | Yes | No |
| Human Editor | As needed | Yes | Yes | Yes | Yes | Review | As needed | Yes |


---

## 20. Recommended Build Phases

### Phase 1 — Prove the Core Workflow

```text
Topic entered manually
      ↓
Desk
      ↓
Author
      ↓
Evidence
      ↓
Author revision
      ↓
Human approval
```

Build this well before automating topic discovery.

### Phase 2 — Add Radar

Add:

- Topic discovery
- Opportunity scoring
- Cluster detection
- Refresh detection

### Phase 3 — Add Production Tooling

Add:

- Code validation
- Diagram pipeline
- Distribution Agent
- Analytics feedback

### Phase 4 — Advanced Intelligence

Add:

- Automatic refresh detection
- Knowledge graph
- Semantic corpus
- Ask Platform Signal
- Newsletter automation
- Performance-informed opportunity scoring


---

## 21. Do Not Add Heavy Orchestration Too Early

A durable workflow system such as Temporal can become valuable later for:

- High concurrency
- Multi-day jobs
- External callbacks
- Complex retries
- Large scheduled workflows

For Platform Signal v1, keep the stack simpler:

```text
LangGraph
   ↓
PydanticAI agents
   ↓
LiteLLM
```

Only add another orchestration layer when operational requirements justify it.


---

## 22. Recommended Internal Names

| Function | Formal Name | Internal Name |
|---|---|---|
| Topic discovery | Content Intelligence Agent | Radar |
| Editorial | Managing Editor Agent | Desk |
| Fact checking | Technical Research Editor | Evidence |
| Writing | Common Author Agent | Author Engine |
| Distribution | Distribution Editor | Amplifier |
| Final approval | Editor-in-Chief | Human Gate |

The internal names are useful operational shorthand and do not need to be public.


---

## 23. Recommended Workflow State Schema

```yaml
workflow_id:
article_id:
opportunity_id:

stage:
status:
assigned_persona:

workflow_version:
agent_versions:
persona_version:

brief_status:
research_status:
draft_status:
verification_status:
editorial_status:
human_status:

created_at:
updated_at:

model_usage:
cost:
latency:

errors: []
```

Persistent state should allow the workflow to stop, be inspected, be corrected, and resume cleanly.


---

## 24. Deterministic Workflow, Flexible Intelligence

Use agents where judgment is required.

Use deterministic tools where correctness can be tested.

Examples:

| Question | Best Mechanism |
|---|---|
| Should this article include a diagram? | Agent |
| Does this YAML parse? | Deterministic |
| Is this topic differentiated enough? | Agent |
| Did CI pass? | Deterministic |
| Does this source support the conclusion? | Research agent |
| Does the URL resolve? | Deterministic |
| Is the recommendation too strong? | Research/editorial agent |
| Does the Kubernetes manifest validate? | Deterministic |


---

## 25. Final Architecture

```text
                       LANGGRAPH
                    Editorial Workflow
                           │
         ┌─────────────────┼──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
      RADAR              DESK              EVIDENCE
   PydanticAI          PydanticAI          PydanticAI
         │                 │                  │
         └─────────────────┼──────────────────┘
                           ▼
                     AUTHOR ENGINE
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          Marcus          Maya         Elias
             │                           │
             └─────────────┬─────────────┘
                           ▼
                          Nia

                    PERSONA = CONTEXT
                    NOT SEPARATE CODE

                           │
                           ▼
                       LiteLLM
                           │
                 MODEL ROUTING LAYER
                           │
              ┌────────────┼─────────────┐
              │            │             │
            OpenAI      Anthropic       Local
                                      Ollama
```


---

## 26. Recommended Build Order

1. Common Author Agent
2. Persona package system
3. Desk / Managing Editor
4. Evidence Editor
5. Human approval gate
6. Git article workflow
7. Structured schemas
8. Version metadata
9. Evaluation suite
10. Radar / Content Intelligence
11. Deterministic code verification
12. Diagram pipeline
13. Distribution Agent
14. Analytics feedback
15. Knowledge graph
16. Semantic search / Ask Platform Signal


---

## 27. Final Principle

The most important decision is not:

> Which model writes Marcus versus Maya?

The important decision is:

> **Can the editorial workflow remain explicit, typed, versioned, auditable, testable, and human-approved?**

Models will change.

Providers will change.

Agent frameworks will change.

The durable asset is the **editorial harness** surrounding them.

Platform Signal should therefore be designed so that:

- Personas are portable
- Agents are modular
- Models are replaceable
- Evidence is auditable
- Workflows are deterministic
- Tool permissions are explicit
- Code is validated mechanically
- Human approval remains final

> **High signal. Low noise. Evidence always.**
