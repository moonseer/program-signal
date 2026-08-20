# Platform Signal — Corrections Policy

**Status:** Public editorial policy  
**Public page:** [`/corrections`](/corrections)  
**Companion:** [`EDITORIAL-STANDARDS.md`](./EDITORIAL-STANDARDS.md) §6

Technical publishing will be wrong sometimes. Credibility comes from handling errors visibly.

---

## Severity

| Severity | Meaning | Public listing on `/corrections` | Article notice |
|---|---|---|---|
| **Minor** | Typo, grammar, formatting, dead link with unchanged meaning | No | Silent fix in the next edit |
| **Clarification** | Wording improved; technical meaning unchanged | Optional short revision note | Optional in-article note |
| **Material** | Wrong version, incorrect command, misstated behavior, bad citation that changes a claim | Required | Required visible notice in the article |
| **Retraction** | Core conclusions are unreliable | Required | Required; rare |

Material errors are corrected transparently rather than silently. Corrections are recorded in article frontmatter (`corrections`) when the schema supports the entry.

---

## How readers report errors

1. Open a GitHub issue against [moonseer/program-signal](https://github.com/moonseer/program-signal/issues/new) with:
   - Article URL or slug
   - The incorrect statement
   - The correct statement (if known)
   - A primary source URL when the error is technical
2. Label or title the issue so it is easy to find (for example, `correction: <slug>`).
3. Do not include secrets, customer data, or exploit payloads in a public issue. For security-sensitive reports, use [`RESPONSIBLE-DISCLOSURE.md`](./RESPONSIBLE-DISCLOSURE.md).

The Editor-in-Chief triages reports. Not every disagreement is an error. Contested analysis stays labeled as analysis unless the underlying facts are wrong.

---

## How we correct

1. Confirm the error against primary sources.
2. Patch the article through the normal PR → validate → human approval path.
3. For **material** errors and **retractions**:
   - Update the article body
   - Add or update a public notice on `/corrections`
   - Set or refresh `updatedAt` / `lastReviewedAt` on the article
4. Do not quietly rewrite history for material claims. Prefer an explicit correction note.

---

## What we do not list

- Style-only edits
- House-style punctuation changes
- Related-link updates that do not change claims
- Diagram redraws that preserve meaning
