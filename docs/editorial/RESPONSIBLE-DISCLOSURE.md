# Platform Signal — Responsible Disclosure

**Status:** Public security and editorial policy  
**Public page:** [`/responsible-disclosure`](/responsible-disclosure)

This policy covers two directions:

1. **Reports to Platform Signal** about this site, repo, or editorial tooling
2. **How Platform Signal handles vulnerabilities** discovered while researching articles

---

## Report a vulnerability in Platform Signal

If you find a security issue in the public site, CI, editorial runtime, or related infrastructure:

1. Prefer a **private** GitHub Security Advisory / private vulnerability report against [moonseer/program-signal](https://github.com/moonseer/program-signal) when available.
2. If private reporting is unavailable, open a GitHub issue titled `SECURITY:` and avoid including exploit details, secrets, or personal data in the public body. Offer a private follow-up channel.
3. Optional encryption for future use may be published here when a contact key is designated. Until then, use GitHub’s private channel.

Please include:

- Affected URL, endpoint, or component
- Steps to reproduce (high level)
- Impact assessment
- Whether you plan public discussion and on what timeline

### Safe harbor for good-faith reports *to* Platform Signal

If you make a good-faith effort to follow this process, avoid privacy violations and service disruption, and do not exploit beyond what is needed to demonstrate the issue, Platform Signal will not pursue legal action for that research against you for the report alone. This is not a bug bounty and does not authorize attacks on third-party systems.

---

## When research finds a vendor or upstream vulnerability

Internal workflow before any public article:

1. **Validate privately** with primary sources and minimal reproduction.
2. **Notify the vendor or maintainer** through their published security contact when one exists.
3. **Coordinate** on severity, fix availability, and disclosure timing when reasonable.
4. **Then publish**, if the story is still editorially warranted.

Public articles:

- May describe impact classes and mitigation guidance
- Must **not** include working exploit details, copy-paste payloads, or step-by-step attack procedures
- Must not pressure vendors with manufactured urgency for clicks

If a story cannot be told without teaching an exploit, do not publish that story in that form.

---

## Relationship to corrections

Ordinary technical errors in published articles use [`CORRECTIONS-POLICY.md`](./CORRECTIONS-POLICY.md). Live security issues in Platform Signal systems use this document.
