# Public references

The evidence ledger is internal. The public page gets a **curated subset**.

| File | Audience |
|---|---|
| `content/articles/<slug>/evidence.yml` | Evidence Editor only |
| `content/articles/<slug>/references.yml` | Readers |
| `editorial/sources.yml` | Canonical source records |

Do not render `evidence.yml` on the article page.

```yaml
references:
  - source_id: SRC-MCP-001
    label: SPECIFICATION
    note: Optional one-line context for the reader
    section: Optional section or heading in the source
    version: Optional
```

Labels: `PRIMARY_SOURCE` · `SPECIFICATION` · `RESEARCH` · `VENDOR_DOCUMENTATION` · `SECONDARY_ANALYSIS`

`source_id` must exist in `editorial/sources.yml`. Topics on that record must be ids from `editorial/sources/taxonomy.yml`.
