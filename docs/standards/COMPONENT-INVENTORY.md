# Component inventory

Design-guide components before inventing new ones. Canonical list: [`PLATFORM-SIGNAL-DESIGN-GUIDE.md`](../PLATFORM-SIGNAL-DESIGN-GUIDE.md) §42.

Status is **spec** until the component exists in `src/` and matches this inventory.

| Component | Status | Notes |
|---|---|---|
| Header | exists | `SiteHeader` — wordmark, primary nav, theme, subscribe |
| Footer | exists | Standards links, persona disclosure |
| Navigation | exists | Articles, Topics, Labs, Field Notes, About |
| Topic menu | exists | `/topics` taxonomy home, not a mega-menu |
| Search dialog | exists | Build-time FlexSearch; not a chat box |
| Feature story | exists | Homepage masthead piece |
| Signal item | exists | Three editorially chosen items |
| Topic section | exists | Cluster, not a category grid |
| Article list | exists | List-first index pages |
| Article card | spec | Use sparingly; lists preferred |
| Lab card | spec | Distinct from article cards |
| Newsletter CTA | exists | “Get the Signal” on homepage and article end |
| Article header | exists | Category, title, persona byline, dates, difficulty |
| At a Glance | spec | MDX table today; dedicated component later |
| Table of contents | exists | Left column on long articles |
| Reading progress | exists | Subtle top bar; respects reduced motion |
| Callout | exists | SIGNAL / PRODUCTION NOTE / WATCH OUT / FIELD NOTE |
| Code block | exists | Language label and copy button |
| Figure | exists | Caption, expand, download SVG |
| Architecture diagram | exists | `PS-D-NNNN`; theme-safe SVG; see `DIAGRAM-STANDARD.md` |
| Comparison table | exists | Scroll on mobile; “Platform Signal take” allowed |
| Recommendation block | exists | Use when / wait when |
| Source list | exists | Curated `references.yml`, not the evidence ledger |
| Related articles | exists | Frontmatter `relatedArticles` |
| Difficulty indicator | exists | Dots in the article header |
| Series navigation | spec | Optional |
| Breadcrumb | spec | Quiet; not a second nav |
| Persona mark | exists | Geometric motif on author pages only |

## Non-goals

Do not introduce:

- Card grids as the default index
- Tag clouds
- Stock AI art
- Glassmorphism
- Robot imagery
- Fake photorealistic author headshots
- Dashboard chrome on article pages
- A different article template per persona

Identity is the byline, a quiet motif on the author page, and the prose. The article template stays the same.
