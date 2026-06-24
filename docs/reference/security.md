# Platform Security

Cypherpunk Code is built with layered protections for learners and infrastructure. This page describes what is public — not internal configuration.

---

## What we protect

| Layer | What it does |
|-------|----------------|
| **Transport** | HTTPS everywhere in production (HSTS) |
| **Headers** | CSP, X-Frame-Options, nosniff, referrer policy |
| **API rate limits** | Throttles wallet auth, feedback, progress, and admin endpoints |
| **Auth** | Solana wallet-adapter sign-in (pick → connect → sign); short-lived nonces; admin via whitelisted Solana wallets |
| **Privacy** | Wallet addresses hashed — raw addresses not stored |
| **Bot filtering** | Honeypot fields and suspicious user-agent blocks |
| **Secrets** | Business security config stored encrypted — never in the public repo |

---

## Learner privacy

- No accounts required to browse the catalog or DOC
- Wallet login uses one-time nonces (5 min TTL, single-use)
- Login tickets expire in 60 seconds
- Progress is tied to a hashed wallet identity, not a raw address

## Solana wallet sign-in flow

The site follows the official `@solana/wallet-adapter` pattern (`ConnectionProvider` → `WalletProvider` → `WalletModalProvider`):

1. **Pick wallet** — choose an installed extension (Phantom, Solflare, etc.)
2. **Connect** — approve the wallet connection popup (same step as Solana docs)
3. **Sign** — approve the sign-in message only; no SOL is spent and no transaction is sent

> **Safety:** Sign-in verifies ownership on mainnet addresses. The app never requests a transfer — approve only the authentication signature.

> **Privacy:** Wallet addresses are not stored; only a one-way hash links learning progress.
- No third-party analytics trackers on core pages

---

## Reporting vulnerabilities

If you discover a security issue, contact [@CHxmrBrother](https://x.com/CHxmrBrother) responsibly. Do not post exploit details publicly before a fix.

See `SECURITY.md` in the repository for disclosure guidelines.