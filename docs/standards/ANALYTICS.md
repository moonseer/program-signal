# Platform Signal — Analytics

**Status:** E24 operating standard  
**Site:** https://platformsignal.dev  
**Constraint:** Stay on Vercel Hobby limits; do not optimize for raw pageviews.

North star: **Monthly Engaged Technical Readers** (not pageviews alone).

---

## Properties

| Property | Role | Status |
|---|---|---|
| **Vercel Web Analytics** | Page views + custom events (light) | Enabled in app via `@vercel/analytics` — turn on in the Vercel project dashboard if not already |
| **Vercel Speed Insights** | Web vitals sample | Enabled via `@vercel/speed-insights` (Hobby ~10k data points / project) |
| **GA4** | Deeper engagement + custom events | Optional: set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel env |
| **Google Search Console** | Queries, impressions, CTR | Operator: add `platformsignal.dev` after public launch / when turning off `noindex` |

---

## Environment

```bash
# Optional — omit until you create a GA4 property
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

No secrets belong in the client bundle beyond the public measurement ID.

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
2. GA4 or Vercel Analytics (engaged sessions + named events)

Do **not** optimize for pageviews alone.

---

## Operator checklist

1. Vercel → Project → Analytics → Enable Web Analytics (and Speed Insights if desired)
2. Create GA4 property for `platformsignal.dev` when ready; add env var; redeploy
3. After turning off `noindex`: Search Console property + submit `https://platformsignal.dev/sitemap.xml`
4. Watch Hobby Fast Data Transfer and Analytics event caps (50k Web Analytics events / month)
