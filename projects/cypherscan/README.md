# CypherScan

Live OSINT intel index — part of the [Cypherpunk Code](https://cypherpunk-code.ca) ecosystem.

**Status:** Beta testing — it might go wrong.

## What it does

- Ingests 32 RSS publishers + 17 OSINT X accounts every 60 seconds
- Rule-based ranking: freshness, source tier, relevance, noise filter
- Sector-balanced index: conflict, geopolitics, cyber, freedom-tech, policy
- No API keys required for the intel feed
- Optional BYOK SITREP scanner (xAI)

## Source

Canonical repository: [github.com/9lordisgod/cypherscan](https://github.com/9lordisgod/cypherscan)

## Run locally

```bash
git clone https://github.com/9lordisgod/cypherscan.git
cd cypherscan
npm install
npm run dev
```

Open http://localhost:3000

## License

See the CypherScan repository for license details.