# Platform Signal — Backup and Content Ownership

**Status:** Operating standard  
**Epic:** E21  
**Companion:** Handbook §24 (Backups & Content Ownership)

The Next.js app can be rebuilt. The editorial corpus (MDX, diagrams, evidence ledgers, briefs, policies, registry) cannot be casually replaced. Markdown in Git remains the source of truth. Avoid architectures where canonical articles live only in a proprietary CMS.

---

## 3-2-1 mapping

| Copy | Where | Media / storage | Cadence |
|---|---|---|---|
| **1 — Primary** | `moonseer/program-signal` on GitHub | Git remote (provider A) | Continuous via normal pushes |
| **2 — Secondary** | Independent Git remote (GitLab, Codeberg/Forgejo, or equivalent) | Separate Git hosting | Weekly automated `--mirror` push |
| **3 — Third** | Compressed archive (`git bundle` + selected trees) | Offline or object storage (not only GitHub) | Monthly |

CISA’s 3-2-1 rule: three copies, two different media/storage types, one off-site. NIST and CISA both emphasize restore testing, not only creating backups.

---

## Ownership principle

- Canonical article bodies live under `content/articles/` as MDX packages.
- Evidence, references, diagrams, briefs, opportunities, and registry live in-repo.
- Vercel hosts the built site; it is not the content system of record.
- Editorial runtime run artifacts under `editorial-runtime/runs/` are operational scratch, not the published corpus. Prefer regenerating from briefs rather than treating runs as durable archives.

---

## Secondary mirror (scheduled)

### One-time operator setup

1. Create an **empty** private (preferred) or public repository on a non-GitHub host.
2. Create a deploy token or SSH key with push access to that repository only.
3. Add GitHub Actions secrets on `moonseer/program-signal`:
   - `BACKUP_MIRROR_URL` — HTTPS clone URL including credentials **or** a URL that works with the token below (example: `https://gitlab.com/org/program-signal-mirror.git`)
   - `BACKUP_MIRROR_TOKEN` — token used as the HTTPS password (username is often `oauth2`, `git`, or the token name; set `BACKUP_MIRROR_USERNAME` if required)
   - Optional: `BACKUP_MIRROR_USERNAME` (defaults to `oauth2`)
4. Run workflow **Backup mirror** → *Run workflow* once and confirm the remote receives a full mirror (all refs).

Until those secrets exist, the weekly workflow exits successfully with a skip notice. Primary GitHub history remains the only automated copy.

### Automation

Workflow: `.github/workflows/backup-mirror.yml`

- Schedule: weekly (Monday 06:00 UTC)
- Also: `workflow_dispatch`
- Action: `git clone --mirror` of this repo, then `git push --mirror` to `BACKUP_MIRROR_URL`

Do not force-push to `main` on GitHub as a recovery method without an explicit restore plan. Prefer restoring from the mirror or a monthly bundle.

---

## Third copy (monthly archive)

### What to include

- Full Git history as a `git bundle --all`
- Working trees that matter even if somehow detached from history convenience:
  - `content/`
  - `docs/`
  - `editorial/`
  - `agents/` (persona and agent specs)
  - Site config: `package.json`, `package-lock.json`, `next.config.*`, `tsconfig.json`, `vercel.json`

### Local command

```bash
./scripts/create-backup-archive.sh
```

Writes under `backups/` (gitignored):

- `program-signal-YYYY-MM-DD.gitbundle`
- `program-signal-corpus-YYYY-MM-DD.tar.gz` (selected trees)
- `program-signal-backup-YYYY-MM-DD.sha256`

Store the three files off GitHub (encrypted disk, object storage, or offline media). Optionally attach the same artifacts to a private release or object bucket via the monthly workflow once `BACKUP_ARCHIVE_UPLOAD` is configured.

### Automation

Workflow: `.github/workflows/backup-archive.yml`

- Schedule: first day of month 07:00 UTC
- Also: `workflow_dispatch`
- Uploads GitHub Actions artifacts (90-day retention). Treat Actions artifacts as a **convenience**, not the durable third copy. Operator must download and store off-site within the retention window.

---

## Newsletter subscribers

No newsletter vendor is active yet. When one exists:

- Treat the vendor as system of record for subscribers.
- Export periodically if the vendor allows (CSV or API dump).
- Store exports with the monthly third-copy archive, never in the public repo.

---

## Quarterly restore test

A backup is not validated until you can rebuild:

```text
Repository (or bundle)
  → install (npm ci)
  → validate:content
  → build
  → verify published article assets (diagrams, evidence)
```

### Local / CI command

```bash
./scripts/restore-test.sh
```

Optional: point at a bundle:

```bash
./scripts/restore-test.sh /path/to/program-signal-YYYY-MM-DD.gitbundle
```

Record the date and result in the E21 section of `docs/BACKLOG.md` (or the PR that closes the quarterly check).

Minimum verification:

1. `npm ci` succeeds
2. `npm run validate:content` passes
3. `npm run build` succeeds
4. At least one launch diagram SVG and its `PS-D-*.yml` exist under `content/articles/`

---

## Emergency recovery order

1. If GitHub is healthy: clone `moonseer/program-signal`, install, build, redeploy via existing CI.
2. If GitHub history is damaged: clone the secondary mirror, push a repaired history to a new GitHub repo or restored remote after review.
3. If both Git remotes fail: `git clone program-signal-YYYY-MM-DD.gitbundle restored/`, verify with `./scripts/restore-test.sh`, then push to a new primary.

---

## Secrets checklist (do not commit values)

| Secret | Purpose |
|---|---|
| `BACKUP_MIRROR_URL` | Secondary remote URL |
| `BACKUP_MIRROR_TOKEN` | Push credential |
| `BACKUP_MIRROR_USERNAME` | Optional HTTPS username |

---

## Sources

- CISA — Back Up Business Data: https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/back-up-business-data
- NIST — Protecting Data from Ransomware/Data Loss: https://csrc.nist.gov/pubs/other/2020/04/24/protecting-data-from-ransomware-and-other-data-los/final
- GitHub — Backing up a repository: https://docs.github.com/en/repositories/archiving-a-github-repository/backing-up-a-repository
