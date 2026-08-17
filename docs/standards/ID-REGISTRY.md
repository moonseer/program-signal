# Permanent ID registry

IDs are immutable. Slugs may change; IDs do not.

| Kind | Pattern | Example |
|---|---|---|
| Article | `PS-` + 6 digits | `PS-000001` |
| Opportunity | `PS-O-` + 4 digits | `PS-O-0001` |
| Diagram | `PS-D-` + 4 digits | `PS-D-0001` |
| Lab | `LAB-` + 4 digits | `LAB-0001` |
| Source | `SRC-` + family + 3 digits | `SRC-K8S-DRA-001` |
| Claim | `C` + 3 digits, **per article** | `C001` |

`editorial/registry.yml` stores the next unused sequence number for each kind. Do not edit it by hand unless you are repairing a broken cursor.

```bash
npm run allocate-id -- article
npm run allocate-id -- opportunity
npm run allocate-id -- diagram
npm run allocate-id -- lab
npm run allocate-id -- source K8S-DRA
npm run allocate-id -- opportunity --dry-run
```

The command prints one ID and advances the registry. It does not create the article, card, or diagram file.

`npm run validate:content` fails if:

- two owner files claim the same ID
- the registry cursor is behind a used ID
- a brief or article references an opportunity that has no card
- a diagram ID is listed on an article before `PS-D-NNNN.yml` exists

Never reuse a retired ID. Skip it and keep going.
