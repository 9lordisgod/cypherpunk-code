# Platform Security

Cypherpunk Code is built with layered protections for learners and infrastructure. This page describes what is public — not internal configuration.

---

## What we protect

| Layer | What it does |
|-------|----------------|
| **Transport** | HTTPS everywhere in production (HSTS) |
| **Headers** | CSP, X-Frame-Options, nosniff, referrer policy |
| **API rate limits** | Throttles feedback endpoints |
| **Bot filtering** | Honeypot fields and suspicious user-agent blocks |
| **Secrets** | Security config stored encrypted — never in the public repo |
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
- Suspicious probe paths (`.env`, `wp-admin`, path traversal) blocked at the API layer

If you suspect compromise, rotate `SECURITY_VAULT_KEY`, database tokens, and deployment secrets immediately.

---

## Learner privacy

- No accounts required to browse the catalog or DOC
- Lightweight first-party anonymous page views (random local ID in localStorage) — no ad cookies, no cross-site tracking
- No third-party analytics trackers on core pages

---

## Reporting vulnerabilities

If you discover a security issue, contact [@CHxmrBrother](https://x.com/CHxmrBrother) responsibly or open a GitHub Security Advisory. Do not post exploit details publicly before a fix.

See [SECURITY.md](../../SECURITY.md) in the repository for disclosure guidelines.