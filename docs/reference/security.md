# Platform Security

Cypherpunk Code is built with layered protections for learners and infrastructure. This page describes what is public — not internal configuration.

---

## What we protect

| Layer | What it does |
|-------|----------------|
| **Transport** | HTTPS everywhere in production (HSTS) |
| **Headers** | CSP, X-Frame-Options, nosniff, referrer policy |
| **API rate limits** | Throttles feedback and admin endpoints |
| **Auth** | Operator admin access only — email/password credentials |
| **Bot filtering** | Honeypot fields and suspicious user-agent blocks |
| **Secrets** | Business security config stored encrypted — never in the public repo |
| **Catalog policy** | HTTPS-only external links; blocked-domain denylist; startup validation |
| **Encryption** | Security vault uses AES-256-GCM (scrypt-derived key) for rate limits and bot rules |

---

## Catalog link safety

External resources in the catalog must:

- Use **HTTPS** only
- Pass a **blocked-domain denylist** (fake or unverified sites are rejected at build/runtime)
- Stay aligned with learning paths (orphan references fail CI tests)

Run `npm run audit:catalog` to probe live URLs before publishing catalog changes.

---

## Malware & compromise checks

The codebase is scanned in CI for backdoor patterns (`npm run security:scan`). Checks include:

- No `eval` / `Function()` in application code
- No reverse-shell or crypto-miner signatures
- No unknown outbound webhooks in runtime code
- Production fails closed if `ADMIN_EMAIL`, `ADMIN_PASSWORD`, or `AUTH_SECRET` are unset
- Suspicious probe paths (`.env`, `wp-admin`, path traversal) blocked at the API layer

If you suspect compromise, rotate `AUTH_SECRET`, `SECURITY_VAULT_KEY`, Turso tokens, and `ADMIN_EMAIL` / `ADMIN_PASSWORD` immediately.

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