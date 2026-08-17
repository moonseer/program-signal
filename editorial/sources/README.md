# Source library

Canonical records live in `editorial/sources.yml`. This directory holds the **conceptual taxonomy**, not a second copy of each source.

Collections:

- `kubernetes`
- `platform-engineering`
- `ai-agents`
- `observability`
- `ai-infrastructure`
- `security`
- `research`

Each source’s `topics` field must use one or more of those ids. Physical per-collection folders are not required; the YAML library is the source of truth.

Allocate ids with `npm run allocate-id -- source FAMILY`.
