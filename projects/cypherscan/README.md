# Cypherscan

Live OSINT intel index — embedded in [Cypherpunk Code](https://cypherpunk-code.ca).

**Live:** [cypherpunk-code.ca/cypherscan](https://cypherpunk-code.ca/cypherscan)

## What it does

- Ingests 32 RSS publishers + 17 OSINT X accounts every 60 seconds
- Rule-based ranking: freshness, source tier, relevance, noise filter
- Sector-balanced index: conflict, geopolitics, cyber, freedom-tech, policy
- No API keys required for the intel feed
- Optional BYOK SITREP scanner (xAI) at `/cypherscan/scanner`

## Source layout

| Path | Purpose |
|------|---------|
| `src/scan/` | Components, hooks, lib, types |
| `src/app/(scan)/cypherscan/` | Live pages (`/cypherscan`, `/cypherscan/scanner`) |
| `src/app/api/feed` | Feed ingest + cache API |
| `src/app/api/health` | Source health API |
| `src/app/api/grok` | BYOK SITREP proxy |

## Run locally

From the cypherpunk-code root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/cypherscan](http://localhost:3000/cypherscan)