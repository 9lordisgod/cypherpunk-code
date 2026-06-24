# Contributing to DOC

The documentation lives in `docs/` and is built with [Honkit](https://github.com/honkit/honkit) (GitBook-compatible).

## Local preview

```bash
# From project root
npm install
npm run docs:dev
```

Open [http://localhost:4000](http://localhost:4000).

## Build for the main site

```bash
npm run docs:build
```

Output is copied to `public/doc/` and served at `/doc/` by Next.js.

## Structure

| File / folder | Purpose |
|---------------|---------|
| `README.md` | Welcome page |
| `SUMMARY.md` | Sidebar navigation |
| `book.json` | Honkit configuration |
| `styles/website.css` | Custom cypherpunk theme |
| `doc/` | Start-here guides (study, platform, mission, roadmap) |
| `bitcoin/` | Bitcoin course track |
| `reference/` | CP Score, paths index, FAQ, glossary |

## Adding a page

1. Create the markdown file
2. Add an entry to `SUMMARY.md`
3. Preview with `npm run docs:dev`
4. Build with `npm run docs:build`

## Editorial guidelines

- Keep content aligned with the cypherpunk mission: privacy, sovereignty, cryptography
- Link to platform resources at `https://cypherpunk-code.com` where relevant
- Maintain the web-first strategy; Seeker dApp is a secondary channel
- All education content must remain 100% free — no paywall language
- Credit [@CHxmrBrother](https://x.com/CHxmrBrother) as curator where appropriate

## Who can edit

This repository is **private and closed source**. Direct edits to code or documentation require maintainer access.

Public transparency commitments — including opening the catalog data layer in Q3 2026 — are documented in [`doc/openness-policy.md`](doc/openness-policy.md).

## Suggesting changes

Anyone can suggest improvements. Contact [@sapherpunk](https://x.com/sapherpunk) on X with:

- The page you want changed
- What should be updated and why
- Any new resources or links to include