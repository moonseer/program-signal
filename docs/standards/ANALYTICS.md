# Platform Signal — Analytics

**Status:** E24 operating standard  
**Site:** https://platformsignal.dev  
**Constraint:** Stay on Vercel Hobby limits; do not optimize for raw pageviews.

North star: **Monthly Engaged Technical Readers** (not pageviews alone).

---

## Cost (Hobby)

| Feature | Hobby | If you exceed |
|---|---|---|
| Web Analytics page views | **Free**, 50k events / month | Collection pauses (no invoice) |
| Speed Insights | **Free**, 10k events / month, 1 project | Collection pauses |
| Vercel **custom events** | **Pro only** | N/A on Hobby |
| GA4 | Free (Google) | Within Google’s free quotas |

Named engagement events in this codebase therefore go to **GA4**, not Vercel `track()`.

---

## Properties

| Property | Role | Status |
|---|---|---|
| **Vercel Web Analytics** | Page views only (light) | `<Analytics />` in layout — enable in the Vercel project dashboard |
| **Vercel Speed Insights** | Web vitals sample | `<SpeedInsights />` (Hobby ~10k / project) |
| **GA4** | Engagement + **custom events** | Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| **Google Search Console** | Queries, impressions, CTR | Operator: after public launch / when turning off `noindex` |

---

## Environment

```bash
# Required for named custom events (copy, diagram, search, …)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

No secrets belong in the client bundle beyond the public measurement ID.

Without this env var, page views still work via Vercel Analytics; custom events are no-ops.

---

## Custom events (implement incrementally)

| Event | When |
|---|---|
| `copy_code` | Code block Copy |
| `diagram_expand` / `diagram_download` | Diagram chrome |
| `source_click` | Reference link |
| `related_article_click` | Related reading link |
| `search_used` | Search returns hits |
| `quick_read_selected` | Articles index filter: field note / Signal / explainer |
| `deep_dive_selected` | Articles index filter: deep dive / lab |
| `newsletter_cta_click` | Subscribe nav / article CTA (signup form deferred with E23) |
| `newsletter_signup` | Reserved for real provider signup (E23) |

---

## 12-month hypotheses (directional, not guarantees)

Documented for the success dashboard; revisit quarterly.

- Content: 80–100 articles, 12 Labs, 8–12 pillars, 6 clusters
- Audience: ~25k monthly organic sessions, 3–5k newsletter subs, rising returning readers
- Authority: 150–250 referring domains
- Quality: low material-correction rate, 100% research coverage on required types, >90% freshness SLA

### Manual dashboard (fine at launch)

Spreadsheet or Looker Studio joining:

1. Search Console (queries + landing pages)
2. GA4 (engaged sessions + named events) and/or Vercel page views

Do **not** optimize for pageviews alone.

---

## Operator checklist

1. Vercel → Project → Analytics → Enable Web Analytics (and Speed Insights if desired)
2. Create GA4 property for `platformsignal.dev`; set `NEXT_PUBLIC_GA_MEASUREMENT_ID`; redeploy
3. After turning off `noindex`: Search Console property + submit `https://platformsignal.dev/sitemap.xml`
4. Watch Hobby caps: 50k Web Analytics events / month; 10k Speed Insights events / month
