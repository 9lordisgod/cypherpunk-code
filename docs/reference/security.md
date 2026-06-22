# Platform Security

Cypherpunk Code is built with layered protections for learners and infrastructure. This page describes what is public — not internal configuration.

---

## What we protect

| Layer | What it does |
|-------|----------------|
| **Transport** | HTTPS everywhere in production (HSTS) |
| **Headers** | CSP, X-Frame-Options, nosniff, referrer policy |
| **API rate limits** | Throttles wallet auth, feedback, progress, and admin endpoints |
| **Auth** | Wallet signatures with short-lived nonces; admin bcrypt |
| **Privacy** | Wallet addresses hashed — raw addresses not stored |
| **Bot filtering** | Honeypot fields and suspicious user-agent blocks |
| **Secrets** | Business security config stored encrypted — never in the public repo |

---

## Learner privacy

- No accounts required to browse the catalog or DOC
- Wallet login uses one-time nonces (5 min TTL, single-use)
- Login tickets expire in 60 seconds
- Progress is tied to a hashed wallet identity, not a raw address
- No third-party analytics trackers on core pages

---

## Reporting vulnerabilities

If you discover a security issue, contact [@CHxmrBrother](https://x.com/CHxmrBrother) responsibly. Do not post exploit details publicly before a fix.

See `SECURITY.md` in the repository for disclosure guidelines.