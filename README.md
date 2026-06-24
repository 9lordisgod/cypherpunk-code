<div align="center">

<img src=".github/app-icon-box.png" alt="Cypherpunk Code app icon" width="128" />

# Cypherpunk Code

**Freedom education for Bitcoin, Monero, and cypherpunk sovereignty.**

[![site](https://img.shields.io/badge/⟡_live-cypherpunk--code.ca-00c853?style=flat-square&labelColor=0d1117)](https://cypherpunk-code.ca)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white&labelColor=0d1117)](https://nextjs.org)
[![Solana](https://img.shields.io/badge/auth-Solana_wallet-9945FF?style=flat-square&logo=solana&logoColor=white&labelColor=0d1117)](https://solana.com/docs/intro/quick-start)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0d1117)](https://www.typescriptlang.org)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white&labelColor=0d1117)](.github/workflows/ci.yml)

<br />

`Next.js 16` · `React 19` · `Prisma` · `Solana wallet-adapter` · `Turso`

<br />

Curated by [**@CHxmrBrother**](https://x.com/CHxmrBrother) · Contact [**@sapherpunk**](https://x.com/sapherpunk)

</div>

<br />

## ◈ Overview

> A curated freedom-education index — courses, papers, guides, and documentation for cryptocurrency, privacy technology, and cypherpunk philosophy. **No trading noise. Just signal.**

<table>
<tr>
<td width="50%">

**Platform**
- [cypherpunk-code.ca](https://cypherpunk-code.ca) — live site
- [/doc/](https://cypherpunk-code.ca/doc/) — study guide & roadmap
- [/catalog](https://cypherpunk-code.ca/catalog) — searchable resource index

</td>
<td width="50%">

**Access**
- [/login](https://cypherpunk-code.ca/login) — learner Solana sign-in
- [/admin/login](https://cypherpunk-code.ca/admin/login) — whitelisted admin wallets
- [/about](https://cypherpunk-code.ca/about) — mission & donations

</td>
</tr>
</table>

<br />

## ◈ Quick start

```bash
git clone <repo-url> && cd cypherpunk-code
npm install
cp .env.example .env.local
npm run db:push          # local SQLite
npm run dev              # http://localhost:3000
```

<details>
<summary><strong>Developer commands</strong></summary>

| Command | What it does |
|---------|----------------|
| `npm run dev` | Development server |
| `npm run build` | Prisma → docs → Next.js production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (28 tests) |
| `npm run docs:dev` | Docs preview on port 4000 |
| `npm run exercise:solana` | Wallet module smoke exercise |
| `npm run verify:solana` | Post-build Solana artifact check |

</details>

<br />

## ◈ Authentication

Solana wallet sign-in via the official [`@solana/wallet-adapter`](https://solana.com/docs/intro/quick-start) stack — **Phantom** and **Solflare**.

```bash
# .env.local
AUTH_SECRET=$(openssl rand -base64 32)
ADMIN_SOLANA_WALLETS=<comma-separated-solana-addresses>
```

| Role | Method | Route |
|:--|:--|:--|
| Learner | Solana wallet connect + sign | `/login` |
| Admin | Whitelisted Solana wallet | `/admin/login` |

<br />

## ◈ Deploy

**Target:** [Vercel](https://vercel.com) · **Domain:** `cypherpunk-code.ca`

<details open>
<summary><strong>1 — Environment variables</strong></summary>

| Variable | Required | Value |
|----------|:--------:|-------|
| `AUTH_SECRET` | ✓ | `openssl rand -base64 32` |
| `AUTH_URL` | ✓ | `https://cypherpunk-code.ca` |
| `DATABASE_URL` | ✓ | Turso libSQL URL |
| `DATABASE_AUTH_TOKEN` | ✓ | Turso auth token |
| `ADMIN_SOLANA_WALLETS` | ✓ | Admin wallet addresses |
| `DEV_LOGIN_ENABLED` | ✓ | `false` |
| `SECURITY_VAULT_KEY` | — | `npm run security:init` |
| `SECURITY_VAULT_B64` | — | Encrypted secrets blob |

</details>

<details>
<summary><strong>2 — Database init (one-time)</strong></summary>

```bash
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:init:turso
```

</details>

<details>
<summary><strong>3 — Build & run</strong></summary>

```bash
npm run build    # prisma generate → docs:build → next build
npm start
```

> SQLite is for local dev only. Production requires Turso — serverless has no persistent disk.

</details>

<br />

## ◈ Architecture

```
cypherpunk-code/
├── src/
│   ├── app/              # Next.js App Router pages & API
│   ├── components/auth/  # SolanaProvider, WalletConnectPanel
│   ├── lib/wallet/       # verify-solana, session, nonce
│   └── data/             # resources.json, paths.json, site.json
├── docs/                 # GitBook documentation source
├── public/branding/      # Logos & wallet icons
├── prisma/               # Schema & migrations
└── tests/                # Vitest unit + DOM tests
```

| File | Purpose |
|------|---------|
| `src/data/resources.json` | Resource catalog |
| `src/data/paths.json` | Learning path sequences |
| `src/data/site.json` | Site name, domain, donations |
| `src/lib/types.ts` | Resource schema (for new entries) |

<br />

## ◈ Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — featured resources |
| `/doc/` | Mission, roadmap, Bitcoin course track |
| `/courses` | Bitcoin Course modules |
| `/catalog` | Filterable catalog with CP Score |
| `/paths` | Curated learning paths |
| `/resource/[id]` | Resource detail page |
| `/about` | About & donation addresses |
| `/login` | Learner wallet sign-in |

<br />

## ◈ Documentation

```bash
npm run docs:dev      # http://localhost:4000
npm run docs:build    # → public/doc/ served at /doc/
```

Maintainer guide: [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md)

<br />

## ◈ Openness policy

Closed source while auth and admin tooling mature. Public transparency via the live site, docs, and roadmap.

| When | What opens |
|------|------------|
| **Q3 2026** | Catalog data layer under open license |
| **After** | Application code in stages |

→ [`docs/doc/openness-policy.md`](docs/doc/openness-policy.md)

<br />

## ◈ Contributing

Private repository — no public PRs, forks, or redistribution.

**Maintainers:** branch → Vercel deploy.

**Community (no code needed):**
- Suggest a resource for the catalog
- Report broken links
- Share feedback on courses or paths

→ [@sapherpunk](https://x.com/sapherpunk) · [contact page](https://cypherpunk-code.ca/about#contact)

<br />

## ◈ Security

Report vulnerabilities **privately** — not on X or public trackers.

→ [@sapherpunk](https://x.com/sapherpunk) · [SECURITY.md](SECURITY.md)

<br />

<div align="center">

**Proprietary — all rights reserved**

Copyright © 2026 Cypherpunk Code · [LICENSE](LICENSE)

*Unauthorized copying, modification, distribution, or use is prohibited.*

</div>