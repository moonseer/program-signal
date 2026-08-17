# Platform Signal — GitHub CI/CD and Vercel Delivery

**Version:** 1.1  
**Date:** August 17, 2026  
**Status:** Secrets configured. Next.js app and `.github/workflows/ci.yml` are in-repo.  
**Hosting:** Vercel Hobby (`moonseer's projects`)  
**Source of truth:** GitHub `main` (`moonseer/program-signal`)

---

## 0. What is already configured (17 Aug 2026)

Walked through the Vercel and GitHub UIs. Values below are **IDs only**. The token is in GitHub Secrets, not in this repo.

| Item | Value / location |
|---|---|
| Vercel team | `moonseer's projects` (`moonseers-projects`) |
| `VERCEL_ORG_ID` | `team_W36wc6rx1KGIdIglXqGio4iq` |
| Vercel project | [program-signal](https://vercel.com/moonseers-projects/program-signal) |
| `VERCEL_PROJECT_ID` | `prj_PdHCNcre9x9c7aGJUj4tpM6JZb9I` |
| `VERCEL_TOKEN` | GitHub Actions secret only. Token name: `program-signal-github-actions`. Scope: moonseer's projects / all projects. Expires **17 Aug 2027**. |
| GitHub secrets | https://github.com/moonseer/program-signal/settings/secrets/actions — `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |

Intentionally **not** clicked “Connect Git” on the Vercel project. Git auto-deploy stays off so GitHub Actions remains the only deployer.

In-repo: `vercel.json` (`git.deploymentEnabled: false`) and `.github/workflows/ci.yml`. First production deploy happens on a green push to `main`.

---

## 1. Goal

Every push is **validated in GitHub Actions first**. Only a passing validation job is allowed to deploy to Vercel.

Vercel does not build from a Git push on its own. That avoids:

- Shipping a broken article or schema to production
- Double builds (Actions + Vercel Git integration)
- Hitting Hobby’s **1 concurrent build** limit with racing PR deploys

```text
git push
    │
    ▼
GitHub Actions  VALIDATE
    │              lint · types · content schema · code fences · production build
    │
    ├── FAIL  →  stop. Vercel is unchanged.
    │
    └── PASS
            │
            ├── pull request / feature branch  →  Vercel PREVIEW
            └── push to main                   →  Vercel PRODUCTION
```

CI proves the **site can be built and the content is structurally valid**. It does not replace the human editorial gate. Agents may open PRs; only a human merges to `main`.

---

## 2. Why not the default Vercel Git integration?

Vercel’s default GitHub app deploys **as soon as GitHub receives the push**, in parallel with Actions. A red CI check would not prevent the site from already updating.

That is the opposite of “validate, then deploy.”

| Approach | When it deploys | Use for Platform Signal? |
|---|---|---|
| Vercel Git integration (default) | Immediately on push | No — skips the gate |
| GitHub Actions → `vercel deploy --prebuilt` | After validate succeeds | **Yes — this is the plan** |

The Vercel project still exists and is linked to the GitHub repo for project metadata. Automatic Git deployments are turned **off**.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": false
  }
}
```

---

## 3. Branching model

| Branch | Role | Vercel environment after CI pass |
|---|---|---|
| `main` | Canonical production | Production (custom domain, when attached) |
| `feature/*` or any other branch | Work in progress | Preview URL |
| Pull request into `main` | Review surface | Preview URL, posted on the PR |

Rules:

1. Do not develop on `main`. Open a branch, push, get a preview, merge.
2. Direct pushes to `main` are still gated: validate must pass or production stays on the last good deploy.
3. `main` requires a PR plus a passing `validate` check (ruleset `main`, squash merge only). There is no owner bypass except turning the ruleset off in GitHub settings.
4. Preview URLs are `noindex`. Production is the only indexed site.

Hobby note: **one concurrent Vercel build**. Sequential “validate then one deploy” is a better fit than Vercel auto-deploying every branch at once.

---

## 4. What “validate” means

Validation grows with the product. The workflow stays the same; jobs get new steps.

### Phase 0 — app exists

- `npm ci`
- ESLint
- TypeScript (`tsc --noEmit`)
- Next.js production build (`next build` or `vercel build`)

If the build fails, nothing deploys.

### Phase 1 — publishing system

Add content CI (same `validate` job):

- Article frontmatter against the Zod schema
- `brief.yml`, `evidence.yml`, `editorial/sources.yml`, `editorial/opportunities/*.yml`, `editorial/briefs/*.yml`
- YAML/JSON parse for committed manifests
- ShellCheck on shell examples
- Fail if a Deep Dive / Operator Guide / Lab is missing required research status fields
- Optional: Mermaid → SVG check if diagrams are generated in CI

### Phase 4+ — editorial operations (not on the deploy path)

Scheduled Actions (daily is enough on Hobby-era thinking; GitHub cron is fine):

- Freshness queue (`reviewAfter < today`)
- Broken-link check

These **open issues or commit queue files**. They never deploy the site by themselves.

### Never in GitHub deploy CI

- LLM research/drafting
- kubectl against a real cluster
- Sending the newsletter
- Independent lab reproduction that needs GPUs or a live cluster

Those stay local, or in separate non-deploy workflows with explicit, non-destructive scope.

---

## 5. Deploy mechanism

Use the Vercel CLI **prebuilt** path so GitHub builds once and Vercel only uploads artifacts:

```text
vercel pull --yes --environment=<preview|production>
vercel build --token=…
vercel deploy --prebuilt [--prod]
```

| Event | Environment flag | Deploy command |
|---|---|---|
| Pull request / non-`main` push | `preview` | `vercel deploy --prebuilt` |
| Push to `main` | `production` | `vercel deploy --prebuilt --prod` |

`vercel build` in Actions is the production-shaped build. `next build` in `validate` catches failures earlier; `vercel build` in `deploy` produces `.vercel/output`. To avoid building twice on the happy path, the intended job split is:

1. **validate** — lint, types, content schema, and `vercel build` (or `next build` until the app is linked)
2. **deploy** — needs validate; uploads the already-built output with `--prebuilt`

If artifact passing between jobs is awkward at first, it is acceptable to run `vercel build` again in `deploy` after validate passed. Optimize to one build once the pipeline is stable.

---

## 6. GitHub Actions layout (to create with the app)

```text
.github/
├── workflows/
│   ├── ci.yml          # validate + deploy (the path that ships the site)
│   └── editorial.yml   # later: scheduled freshness / link check (no deploy)
├── PULL_REQUEST_TEMPLATE.md
└── CODEOWNERS            # optional; single owner is fine
```

### 6.1 Intended `ci.yml` shape

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run validate:content   # added in Phase 1; no-op or omitted in P0
      - run: npm run build

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm install --global vercel@latest
      - name: Pull Vercel env
        run: vercel pull --yes --environment=${{ github.ref == 'refs/heads/main' && 'production' || 'preview' }} --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build
        run: vercel build ${{ github.ref == 'refs/heads/main' && '--prod' || '' }} --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy
        id: deploy
        run: |
          if [ "${GITHUB_REF}" = "refs/heads/main" ]; then
            url=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
          else
            url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          fi
          echo "url=$url" >> "$GITHUB_OUTPUT"
      - name: Comment preview URL on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `Preview: ${{ steps.deploy.outputs.url }}`
            })
```

Exact YAML will be written when the Next.js app and npm scripts exist. Treat the above as the contract, not as a file to commit before the app boots.

### 6.2 Concurrency

- Cancel in-progress CI on the **same branch** when a newer push arrives.
- Do **not** cancel a `main` production deploy mid-upload if a second `main` push is rare; if it happens, the later SHA should win. `concurrency` grouped by ref is enough.

---

## 7. Secrets and Vercel project setup

GitHub repo secrets (Settings → Secrets and variables → Actions):

| Secret | Purpose |
|---|---|
| `VERCEL_TOKEN` | Hobby account token (Vercel → Account Settings → Tokens) |
| `VERCEL_ORG_ID` | From `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | Same file |

Setup sequence when we start coding:

1. Create the Next.js app in this repo.
2. Create a Vercel Hobby project; `vercel link` locally (do not commit `.vercel/` if it contains user-specific paths — `project.json` ids can be documented; tokens never go in Git).
3. Set `git.deploymentEnabled: false` in `vercel.json`.
4. Store the three secrets on GitHub.
5. Add `ci.yml`.
6. Push a branch, confirm validate runs, confirm a **preview** URL appears only after green.
7. Merge to `main`, confirm **production** updates only after green.
8. Attach the custom domain later (Phase 3). Until then, the Vercel production URL is fine.

Do not commit `.env`, newsletter API keys, or the Vercel token.

---

## 8. GitHub repository settings

When the workflow is live:

1. **Ruleset on `main`** (active)
   - Pull request required; squash merge only
   - Require status check `validate` (the job name in `ci.yml`)
   - No bypass actors; emergency break-glass is disabling the ruleset in repo settings
2. **PR template** includes opportunity id, Desk `editorial_decision`, Research Editor status, and human Editor-in-Chief approval. CI does not tick those; the human does.
3. **Vercel Hobby** has no team RBAC. GitHub is where review happens.

A failed `validate` means `deploy` does not run. Proven on [#1](https://github.com/moonseer/program-signal/pull/1).

---

## 9. Publishing an article (day-to-day)

```text
Radar opportunity → Desk brief → branch → write MDX + evidence
    →  git push
    →  Actions VALIDATE
    →  Vercel PREVIEW  (read the article as it will look)
    →  Desk final review + human Editor-in-Chief approval on the PR
    →  merge to main
    →  Actions VALIDATE again on main
    →  Vercel PRODUCTION
```

If validate fails (broken YAML, invalid frontmatter, failed `next build`), preview/production are not updated. Fix the branch and push again.

---

## 10. Hobby constraints this pipeline respects

| Constraint | How the pipeline handles it |
|---|---|
| 1 concurrent build | One deploy job after validate; cancel stale branch runs |
| 45 minute build | Static Next.js + committed SVGs preferred over heavy runtime diagram work |
| 100 deployments / day | No deploy on `editorial.yml`; don’t push noise to `main` |
| 100 GB transfer | Deploy does not change this; keep assets small in the app |
| No commercial Hobby use | Pipeline does not add billing/sponsor features |
| Function CPU | Prefer SSG so deploys are static output, not a fleet of functions |
| Cron on Vercel is daily-only | Freshness jobs live in GitHub Actions, not Vercel Cron |

---

## 11. Failure behavior

| Failure | Result |
|---|---|
| Lint / types / schema / build | `validate` red; `deploy` skipped; last good Vercel deploy stays live |
| Vercel token missing/expired | `validate` may be green; `deploy` red; site unchanged; fix secrets |
| Vercel Hobby quota (build/deploy) | Deploy fails; Git still has the commit; retry after quota resets or reduce deploy chatter |
| Preview comment step fails | Deploy already succeeded; comment is best-effort |
| Human has not approved the article | Do not merge. CI green is not publication approval |

Rollback: revert on `main` (or `git revert`) and let CI deploy the previous good tree. Optionally `vercel rollback` from the dashboard for an emergency, then make Git match.

---

## 12. What we will implement vs later

**With the first app scaffold (P0)**

- [x] `vercel.json` with Git auto-deploy disabled
- [x] GitHub secrets
- [x] `ci.yml` with validate → deploy
- [x] README section: how to get a preview
- [x] Confirm Hobby production URL updates only on green `main`

**With the publishing system (P1)**

- [x] `npm run validate:content` in the validate job (articles **and** `editorial/opportunities`, `editorial/briefs`)
- [ ] ShellCheck + YAML/JSON
- [x] PR template for Desk + Evidence + human gates
- [x] `main` ruleset requiring `validate`

**Public launch (P3)**

- [ ] Custom domain on the production deployment
- [ ] Production `noindex` off; preview `noindex` on

**First 90 days (P4)**

- [ ] `editorial.yml` scheduled freshness / link check (no Vercel deploy; does not run Radar web scraping)

---

## 13. Relationship to other docs

| Doc | Role |
|---|---|
| [BACKLOG.md](./BACKLOG.md) | Epics/stories; CI/CD stories point here |
| [PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md](./PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md) | The Radar + The Desk; neither publishes |
| Editorial standards / Research Editor | What a human must approve; CI does not do this |
| Content schemas | What `validate:content` will enforce |

The delivery rule for this repo:

> **GitHub validates. Vercel only receives a successful build. A human still decides what is true enough to merge.**
