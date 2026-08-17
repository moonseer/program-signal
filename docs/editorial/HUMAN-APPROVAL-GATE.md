# Human approval gate

**Constitution:** [`EDITORIAL-STANDARDS.md`](./EDITORIAL-STANDARDS.md)  
**PR template:** [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md)

Discovery is not approval. Automated checks are not approval.

```text
RADAR          opportunity card
  │
DESK           APPROVE / reframe / hold / merge / reject / watch
  │
BRIEF          editorial/briefs/PS-NNNNNN.yml
  │
AUTHOR         draft in assigned persona
  │
EVIDENCE EDITOR
  ├── PASS
  ├── PASS WITH CHANGES → required revisions → re-verify
  ├── HOLD
  └── FAIL
  │
DESK           READY FOR HUMAN APPROVAL
               (does not override evidence)
  │
CI             lint · types · content schema · build
  │
HUMAN EDITOR-IN-CHIEF
  │
PUBLISH
```

## Four parts, all required

| Part | Owner | Passing state |
|---|---|---|
| 1. Evidence | Technical Research Editor | `PASS`, or `PASS WITH CHANGES` after required changes are completed |
| 2. Editorial | The Desk | `READY FOR HUMAN APPROVAL` |
| 3. Automated | GitHub Actions `validate` | green |
| 4. Human | Editor-in-Chief | checkbox on the PR |

None of these may be skipped because another part passed.

## Who cannot publish

The Radar, The Desk, author personas, and the Evidence Editor cannot publish. Agents may open pull requests. Only a human merges production content.

## PR requirements

Every content PR records:

- Opportunity ID (`PS-O-NNNN`)
- Desk decision
- Content type and persona
- Research Editor status
- Human Editor-in-Chief approval

Merge to `main` without the human checkbox is a process failure even if CI is green.
