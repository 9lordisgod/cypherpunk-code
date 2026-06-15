# CypherScan

Live OSINT intel index — embedded in [Cypherpunk Code](https://cypherpunk-code.ca).

**Status:** Beta testing — it might go wrong.

**Live:** [cypherpunk-code.ca/scan](https://cypherpunk-code.ca/scan)

## What it does

- Ingests 32 RSS publishers + 17 OSINT X accounts every 60 seconds
- Rule-based ranking: freshness, source tier, relevance, noise filter
- Sector-balanced index: conflict, geopolitics, cyber, freedom-tech, policy
- No API keys required for the intel feed
- Optional BYOK SITREP scanner (xAI) at `/scan/scanner`

## Source layout

| Path | Purpose |
|------|---------|
| `src/scan/` | Components, hooks, lib, types |
| `src/app/(scan)/scan/` | Live pages (`/scan`, `/scan/scanner`) |
| `src/app/api/feed` | Feed ingest + cache API |
| `src/app/api/health` | Source health API |
| `src/app/api/grok` | BYOK SITREP proxy |

Upstream development repo: [github.com/9lordisgod/cypherscan](https://github.com/9lordisgod/cypherscan)

## Run locally

From the cypherpunk-code root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/scan](http://localhost:3000/scan)