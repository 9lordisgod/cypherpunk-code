<p align="center">
  <a href="https://cypherpunk-code.ca">
    <img src=".github/logo.png" alt="Cypherpunk Code" width="120" />
  </a>
</p>

<h1 align="center">Cypherpunk Code</h1>

<p align="center">
  <strong>Freedom education for Bitcoin, Monero, and cypherpunk sovereignty.</strong>
</p>

<p align="center">
  <a href="https://cypherpunk-code.ca"><img src="https://img.shields.io/badge/site-cypherpunk--code.ca-00c853?style=for-the-badge" alt="Site" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  <a href="https://solana.com"><img src="https://img.shields.io/badge/auth-Solana%20wallet-9945FF?style=for-the-badge&logo=solana" alt="Solana auth" /></a>
</p>

<p align="center">
  Curated by <a href="https://x.com/CHxmrBrother">@CHxmrBrother</a> · Contact <a href="https://x.com/sapherpunk">@sapherpunk</a>
</p>

---

## Overview

Cypherpunk Code is a curated freedom-education platform: courses, papers, guides, and documentation for cryptocurrency, privacy technology, and cypherpunk philosophy. No trading noise — just signal.

| | |
|---|---|
| **Live site** | [cypherpunk-code.ca](https://cypherpunk-code.ca) |
| **Documentation** | [/doc/](https://cypherpunk-code.ca/doc/) |
| **Admin** | [/admin/login](https://cypherpunk-code.ca/admin/login) (whitelisted Solana wallets) |

---

## Table of contents

- [Quick start](#quick-start)
- [Authentication](#authentication)
- [Deploy on Vercel](#deploy-on-vercel)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Site pages](#site-pages)
- [Openness policy](#openness-policy)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Quick start

```bash
git clone <repo-url>
cd cypherpunk-code
npm install
cp .env.example .env.local
npm run db:push    # local SQLite
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Useful scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (Prisma + docs + Next.js) |
| `npm run lint` | ESLint |
| `npm test` | Vitest test suite |
| `npm run docs:dev` | Preview docs at port 4000 |

---

## Authentication

Learners and admins sign in with a **Solana wallet** (Phantom, Solflare) using the official [`@solana/wallet-adapter`](https://solana.com/docs/intro/quick-start) stack. Progress and feedback are stored in the database.

```bash
# .env.local (minimum for local auth)
AUTH_SECRET=<openssl rand -base64 32>
ADMIN_SOLANA_WALLETS=<comma-separated-admin-addresses>
```

| Role | Sign-in | Route |
|------|---------|-------|
| Learner | Solana wallet | `/login` |
| Admin | Whitelisted Solana wallet | `/admin/login` |

---

## Deploy on Vercel

1. Connect this private GitHub repo to [Vercel](https://vercel.com).
2. Configure environment variables:

| Variable | Required | Notes |
|----------|----------|-------|
| `AUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `AUTH_URL` | Yes | `https://cypherpunk-code.ca` (no trailing slash) |
| `DATABASE_URL` | Yes | Turso libSQL URL |
| `DATABASE_AUTH_TOKEN` | Yes | Turso auth token |
| `ADMIN_SOLANA_WALLETS` | Yes | Comma-separated admin addresses |
| `DEV_LOGIN_ENABLED` | Yes | `false` in production |
| `SECURITY_VAULT_KEY` | Optional | See `npm run security:init` |
| `SECURITY_VAULT_B64` | Optional | Encrypted secrets blob |

3. **One-time database setup** after env is configured:

```bash
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:init:turso
```

4. Deploy. The build runs `prisma generate` → `docs:build` → `next build`. Schema changes are **not** applied automatically during build.

```bash
npm run build
npm start
```

> Local SQLite does not persist on serverless — use Turso in production.

---

## Project structure

| Path | Purpose |
|------|---------|
| `src/data/resources.json` | Resource catalog database |
| `src/data/paths.json` | Learning path sequences |
| `src/data/site.json` | Site name, domain, donations |
| `src/components/auth/` | Solana wallet connect UI |
| `src/lib/wallet/` | Wallet verification and session |
| `docs/` | GitBook-style documentation source |
| `public/branding/` | Logos and wallet icons |

Site name, domain, and donation addresses live in `site.json`.

**Adding resources** — add entries to `resources.json` following the schema in `src/lib/types.ts`, then rebuild.

---

## Documentation

GitBook-style docs in `docs/`:

```bash
npm run docs:dev      # http://localhost:4000
npm run docs:build    # → public/doc/ (served at /doc/)
```

Maintainers: see [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for structure and editing notes.

---

## Site pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured resources |
| `/doc/` | Study guide, mission, roadmap, Bitcoin course |
| `/courses` | Bitcoin Course modules |
| `/catalog` | Searchable catalog with CP Score |
| `/paths` | Curated learning paths |
| `/resource/[id]` | Resource detail |
| `/about` | About and donations |
| `/login` | Learner Solana wallet sign-in |

---

## Openness policy

The application is **closed source** while auth, wallet sign-in, and admin tooling mature. That is intentional.

Public transparency where it matters: the live site, mission, roadmap, and documentation remain open to learners.

| Milestone | What opens |
|-----------|------------|
| **Q3 2026** | Catalog data layer (`resources.json`, `paths.json`, `site.json`) under an open license when the submission form ships |
| **After that** | Application code in stages as wallet and auth stabilize |

Full policy: [`docs/doc/openness-policy.md`](docs/doc/openness-policy.md) · served at `/doc/` after `npm run docs:build`.

---

## Contributing

This is a **private, closed-source** repository. Public pull requests, forks, and redistribution are not permitted.

**Maintainers** with repo access work on branches and deploy via Vercel.

**Everyone else** can help without code:

- Suggest a resource — URL and why it belongs in the catalog
- Report a broken link — resource name and what happens
- Share feedback — catalog, courses, or learning paths

Reach [@sapherpunk](https://x.com/sapherpunk) on X or the [contact page](https://cypherpunk-code.ca/about#contact).

---

## Security

Report vulnerabilities **privately**. Do not post details on X, forums, or public issue trackers.

- [@sapherpunk](https://x.com/sapherpunk) on X
- [Contact page](https://cypherpunk-code.ca/about#contact)

Include description, reproduction steps, and potential impact. We aim to acknowledge within 48 hours.

Full policy: [SECURITY.md](SECURITY.md).

---

## License

**Proprietary — all rights reserved.**

Copyright © 2026 Cypherpunk Code · [LICENSE](LICENSE)

- Private and confidential repository
- Unauthorized copying, modification, distribution, or use is prohibited
- Licensing inquiries: [@sapherpunk](https://x.com/sapherpunk)

Third-party materials (e.g. Plan ₿ Network course content) remain under their original licenses and are attributed separately.