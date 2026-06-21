# Cypherpunk Code

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Open education index for Bitcoin, Monero, and cypherpunk sovereignty.

**Domain:** [cypherpunk-code.ca](https://cypherpunk-code.ca)

Curated by [@CHxmrBrother](https://x.com/CHxmrBrother).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth, progress, and admin

Learners sign in with Solana or Bitcoin wallets. Progress and feedback are stored in the database. Admins use email/password at `/admin/login`.

```bash
cp .env.example .env.local
# Set AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, then:
npm run db:push
npm run dev
```

## Deploy (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Set environment variables in the Vercel project:
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `AUTH_URL` — `https://cypherpunk-code.ca`
   - `DATABASE_URL` + `DATABASE_AUTH_TOKEN` — [Turso](https://turso.tech) libSQL (recommended; local SQLite does not persist on serverless)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` (bcrypt hash recommended)
   - `DEV_LOGIN_ENABLED` — `false`
3. Deploy. The build runs `prisma db push` then `next build`.

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

## Pages

- `/` — Homepage with featured resources
- `/catalog` — Searchable, filterable catalog with CP Score
- `/paths` — Curated learning paths
- `/resource/[id]` — Resource detail pages
- `/about` — About + donation info
- `/roadmap` — Project roadmap

## Adding resources

Add entries to `resources.json` following the schema in `src/lib/types.ts`. Rebuild to publish.

## License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

See the [LICENSE](LICENSE) file for details.

This means:
- You are free to use, modify, and distribute the code.
- If you run a modified version as a network service (e.g. a hosted version of the site), you must make the corresponding source available to users.
- The license ensures the project remains open and aligned with cypherpunk principles of transparency and sovereignty.

## Security

If you discover a security vulnerability, please report it responsibly. See `SECURITY.md` (or open an issue with details if no file exists yet).