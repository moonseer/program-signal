# Platform Signal

Evidence-led technical publication on production AI, Kubernetes, platform engineering, and agent infrastructure.

**High signal. Low noise. Evidence always.**

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run build
```

## Delivery

GitHub Actions validates, then deploys to Vercel Hobby. Vercel Git auto-deploy is off. See `docs/CI-CD.md`.

Production updates only from green `main`. A human still approves editorial merges.

Hobby is **personal / non-commercial**. Sponsorship, paid newsletters, and other monetization require Vercel Pro.

## License

Site software (`src/`, `scripts/`, app config) is MIT. Editorial materials under `content/` and `editorial/` are all rights reserved. See `LICENSE`.

Permanent IDs are allocated with `npm run allocate-id`. See `docs/standards/ID-REGISTRY.md`.

## Docs

Start with `docs/BACKLOG.md`. Control-layer agents: `docs/PLATFORM-SIGNAL-EDITORIAL-AND-TOPIC-AGENTS.md`. Constitution: `docs/editorial/EDITORIAL-STANDARDS.md`.
