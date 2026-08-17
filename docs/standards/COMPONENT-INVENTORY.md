# Component inventory

Design-guide components before inventing new ones. Canonical list: [`PLATFORM-SIGNAL-DESIGN-GUIDE.md`](../PLATFORM-SIGNAL-DESIGN-GUIDE.md) §42.

Status is **spec** until the component exists in `src/` and matches this inventory.

| Component | Status | Notes |
|---|---|---|
| Header | exists | `SiteHeader` — wordmark, primary nav, theme, subscribe |
| Footer | exists | Standards links, persona disclosure |
| Navigation | exists | Articles, Topics, Labs, Field Notes, About |
| Topic menu | spec | Taxonomy home, not a mega-menu |
| Search dialog | spec | Build-time index later; not a chat box |
| Feature story | spec | Homepage masthead piece |
| Signal item | spec | Three editorially chosen items |
| Topic section | spec | Cluster, not a category grid |
| Article list | exists | List-first index pages |
| Article card | spec | Use sparingly; lists preferred |
| Lab card | spec | Distinct from article cards |
| Newsletter CTA | spec | “Get the Signal” |
| Article header | exists | Category, title, persona byline, dates, difficulty |
| At a Glance | spec | MDX table today; dedicated component later |
| Table of contents | spec | Left column on long articles |
| Reading progress | spec | Subtle; respect reduced motion |
| Callout | exists | SIGNAL / PRODUCTION NOTE / WATCH OUT / FIELD NOTE |
| Code block | spec | Language, copy, no page overflow |
| Figure | spec | Caption required |
| Architecture diagram | spec | `PS-D-NNNN`; alt text required |
| Comparison table | spec | Scroll on mobile; “Platform Signal take” allowed |
| Recommendation block | spec | Use when / wait when |
| Source list | exists | Curated `references.yml`, not the evidence ledger |
| Related articles | spec | Frontmatter `relatedArticles` |
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
