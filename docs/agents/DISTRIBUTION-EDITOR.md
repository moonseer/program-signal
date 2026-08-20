# Platform Signal — Distribution Editor

**Role:** Human founder / EiC (assisted later by a distribution agent; never autonomous)  
**Phase:** P3 launch distribution (E25)  
**Does not:** invent claims, soften evidence findings, spam identical blurbs, or publish without the human gate already satisfied.

Distribution amplifies finished, researched work. It does not replace editorial standards.

Operating principle for promotion:

> One takeaway. One diagram or concrete rule. One link. Channel-native framing.

---

## Hard rules

1. **Never paste one generic blurb everywhere.** Rewrite for each channel.
2. **Do not oversell.** No “definitive guide,” “everything you need,” or fake urgency.
3. **Personas stay personas.** Do not present Maya/Marcus/Elias/Nia as real individuals in social posts. Attribute as “Platform Signal” or “in the [persona] editorial voice.”
4. **Evidence travels.** If the piece depends on a dated survey or vendor doc, the post should not widen the claim.
5. **HN is selective.** Prefer original Labs, operator guides with runnable specificity, and architecture pieces with a sharp thesis. Skip thin explainers and most Signal roundups.
6. **Reddit is useful or silent.** Lead with a question or a constraint the community cares about; never a bare link dump.
7. **Newsletter blurbs wait for E23.** Until capture exists, use LinkedIn / short social / HN / Reddit only.
8. **`noindex` does not block distribution.** Soft-launch can still share `https://platformsignal.dev/...` for direct and social traffic. Turning off `noindex` is a separate public-search decision.

---

## Channel templates

Base URL: `https://platformsignal.dev/articles/<slug>`

### LinkedIn (founder)

Structure:

1. One-sentence takeaway (operator or architect consequence)
2. One concrete detail (diagram, matrix, failure mode, versioned rule)
3. Optional: one honest limit (“what this is not”)
4. Link on its own line

Avoid: carousel of buzzwords, “excited to share,” hashtag walls.

### Hacker News

Use only when the piece has:

- Original framing or a non-obvious decision table, **or**
- Operator specificity (commands, failure modes, workload identity), **or**
- A Lab with reproducibility notes

Title: descriptive, not clickbait. First comment (optional): methodology caveat or “what I still don’t know.”

Do **not** use HN for every explainer in a cluster.

### Reddit

Pick a community that already debates the problem (platform engineering, SRE, AI infra, careers for FDE pieces). Post body:

- Problem statement in the community’s language
- What the article adds (table, checklist, boundary)
- Link once
- Invite disagreement on a specific claim

No multi-sub drive-by identical posts in one hour.

### Short social (X / similar)

Max one idea. Prefer diagram alt-text style clarity. Link optional if character budget is tight; never thread a full article summary.

### Newsletter (when E23 exists)

One Signal-style lede: what changed, who should care, one link to the deep piece. Half the value must stand without the click.

---

## Per-article package (optional files)

When useful, draft in the article folder (human-edited before posting):

```text
content/articles/<slug>/distribution/
  linkedin.md
  hn.md          # omit if not HN-worthy
  reddit.md      # omit if not appropriate
  short.md
```

Do not commit unfinished spam drafts. Prefer writing the posts in the moment from this playbook.

---

## Feedback loop

Capture useful reader pushback as Radar opportunities:

1. Note the question or objection
2. Open or update a card under `editorial/opportunities/`
3. Do not treat engagement volume as editorial importance

---

## Anti-patterns

| Do not | Why |
|---|---|
| Post all 12 launch URLs in one day | Looks like a content dump; burns trust |
| Same paragraph on LinkedIn + Reddit + HN | Channel mismatch; spam signals |
| “AI wrote this but…” framing | Undermines the human gate story |
| Vendor praise without the article’s caveats | Violates independence |
| HN for every Signal | Dilutes HN capital |

---

## Related

- Launch week sequence: [`../editorial/LAUNCH-WEEK-PLAN.md`](../editorial/LAUNCH-WEEK-PLAN.md)
- Editorial standards: [`../editorial/EDITORIAL-STANDARDS.md`](../editorial/EDITORIAL-STANDARDS.md)
- Cadence / channels: [`../PLATFORM-SIGNAL-CONTENT-CADENCE.md`](../PLATFORM-SIGNAL-CONTENT-CADENCE.md)
