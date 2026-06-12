# Cypherpunk Code

Open education index for Bitcoin, Monero, and cypherpunk sovereignty.

**Domain:** [cypherpunk-code.ca](https://cypherpunk-code.ca)

Curated by [@CHxmrBrother](https://x.com/CHxmrBrother).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Works on Vercel, Cloudflare Pages, or any Node host:

```bash
npm run build
npm start
```

Static export is possible later if you drop client-side search (currently uses React state).

## Customize

| File | Purpose |
|------|---------|
| `src/data/resources.json` | Resource database (58 entries seeded) |
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