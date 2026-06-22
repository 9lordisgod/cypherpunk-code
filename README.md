# Cypherpunk Code

Freedom education for Bitcoin, Monero, and cypherpunk sovereignty.

**Domain:** [cypherpunk-code.ca](https://cypherpunk-code.ca)

Curated by [@CHxmrBrother](https://x.com/CHxmrBrother). Project contact: [@sapherpunk](https://x.com/sapherpunk).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth, progress, and admin

Learners sign in with Solana or Bitcoin wallets. Progress and feedback are stored in the database. Admins sign in with a whitelisted Solana wallet at `/admin/login`.

```bash
cp .env.example .env.local
# Set AUTH_SECRET, ADMIN_SOLANA_WALLETS, then:
npm run db:push   # local SQLite
npm run dev
```

## Deploy (Vercel)

1. Connect this private GitHub repo to [Vercel](https://vercel.com).
2. Set environment variables:
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `AUTH_URL` — `https://cypherpunk-code.ca` (no trailing slash)
   - `DATABASE_URL` + `DATABASE_AUTH_TOKEN` — [Turso](https://turso.tech) libSQL (required for production; local SQLite does not persist on serverless)
   - `ADMIN_SOLANA_WALLETS` — comma-separated Solana addresses allowed to access `/admin`
   - `DEV_LOGIN_ENABLED` — `false`
   - `SECURITY_VAULT_KEY` + `SECURITY_VAULT_B64` — optional but recommended (see `npm run security:init`)
3. **One-time database setup** (after first deploy env is configured):

```bash
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:init:turso
```

4. Deploy. The build runs `prisma generate`, `docs:build`, then `next build` — it does **not** apply schema changes automatically.

```bash
npm run build
npm start
```

## Customize

| File | Purpose |
|------|---------|
| `src/data/resources.json` | Resource database |
| `src/data/paths.json` | Learning path sequences |
| `src/data/site.json` | Site name, creator handle, donation addresses |

Site name, domain, and donation addresses are configured in `site.json`.

## Documentation (DOC)

GitBook-style documentation in `docs/`:

```bash
npm run docs:dev      # Preview at http://localhost:4000
npm run docs:build    # Build → public/doc/ (served at /doc/)
```

See `docs/CONTRIBUTING.md` for structure and editing guide.

## Pages

- `/` — Homepage with featured resources
- `/doc/` — Study guide, mission, roadmap, Bitcoin course track
- `/courses` — Bitcoin Course modules
- `/catalog` — Searchable, filterable catalog with CP Score
- `/paths` — Curated learning paths
- `/resource/[id]` — Resource detail pages
- `/about` — About + donation info
- `/roadmap` — Project roadmap

## Adding resources

Add entries to `resources.json` following the schema in `src/lib/types.ts`. Rebuild to publish.

## Openness policy

The application is **closed source at this stage** — auth, wallet sign-in, and admin tooling are still maturing. That is intentional.

We compensate with public transparency where it matters: the live site, mission, roadmap, and documentation are all open to learners.

**Opening schedule (data first, code second):**

- **Q3 2026** — when the resource submission form ships, we publish the catalog data layer (`resources.json`, `paths.json`, `site.json`) under an open license
- **After that** — application code opens in stages as wallet, auth, and tooling stabilize (no fixed date for full open source yet)

Full policy: [`docs/doc/openness-policy.md`](docs/doc/openness-policy.md) (also served at `/doc/` after `npm run docs:build`).

## Contributing

This is a **private, closed-source** repository. The codebase is not open for public pull requests, forks, or redistribution.

**Maintainers** with repo access can work on branches and deploy through the normal Vercel workflow.

**Everyone else** can still help the project without touching code:

- **Suggest a resource** — send the URL and why it belongs in the catalog
- **Report a broken link** — include the resource name and what happens when you click
- **Share feedback** — ideas for the catalog, courses, or learning paths

Contact [@sapherpunk](https://x.com/sapherpunk) on X or use the [contact page](https://cypherpunk-code.ca/about#contact).

Documentation structure and editing notes for maintainers are in [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

## License

**Proprietary — all rights reserved.**

Copyright © 2026 Cypherpunk Code. See [LICENSE](LICENSE) for the full terms.

- This repository is private and confidential
- Unauthorized copying, modification, distribution, or use is prohibited
- Licensing inquiries: [@sapherpunk](https://x.com/sapherpunk)

Third-party materials used on the site (for example Plan ₿ Network course content) remain under their original licenses and are attributed separately.

## Security

If you discover a security vulnerability, report it **privately**. Do not post details publicly on X, forums, or issue trackers.

**Report to:**

- [@sapherpunk](https://x.com/sapherpunk) on X, or
- the [contact page](https://cypherpunk-code.ca/about#contact)

Include a description, steps to reproduce, and potential impact. We aim to acknowledge reports within 48 hours.

Full policy: [SECURITY.md](SECURITY.md).