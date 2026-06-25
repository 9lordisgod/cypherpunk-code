# Platform Security

Cypherpunk Code is built with layered protections for learners and infrastructure. This page describes what is public — not internal configuration.

---

## What we protect

| Layer | What it does |
|-------|----------------|
| **Transport** | HTTPS everywhere in production (HSTS) |
| **Headers** | CSP, X-Frame-Options, nosniff, referrer policy |
| **API rate limits** | Throttles feedback and admin endpoints |
| **Auth** | Operator admin access only — no public wallet sign-in |
| **Bot filtering** | Honeypot fields and suspicious user-agent blocks |
| **Secrets** | Business security config stored encrypted — never in the public repo |

---

## Learner privacy

- No accounts required to browse the catalog or DOC
- No wallet connection or sign-in flow on the public site
- Lightweight first-party anonymous page views (random local ID in localStorage) — no ad cookies, no cross-site tracking
- No third-party analytics trackers on core pages

---

## Reporting vulnerabilities

If you discover a security issue, contact [@CHxmrBrother](https://x.com/CHxmrBrother) responsibly. Do not post exploit details publicly before a fix.

See `SECURITY.md` in the repository for disclosure guidelines.