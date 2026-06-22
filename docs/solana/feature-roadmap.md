# Feature Roadmap

Detailed feature specifications for Cypherpunk Code — from current web platform to future Seeker dApp.

---

## Current features (Live)

### Core education

| Feature | Description | Status |
| --- | --- | --- |
| Resource catalog | 67+ curated resources with search and filters | ✅ Live |
| Cypherpunk Score | Editorial relevance rating (1–10) | ✅ Live |
| Learning paths | 6 structured study sequences | ✅ Live |
| Resource detail pages | Full metadata, tags, direct links | ✅ Live |
| Topic browsing | Filter by bitcoin, monero, opsec, etc. | ✅ Live |
| Multilingual UI | EN, FR, JA, ZH metadata translation | ✅ Live |
| DOC (GitBook) | Platform documentation and study guides | ✅ Live |

### Platform

| Feature | Description | Status |
| --- | --- | --- |
| No accounts required | Browse freely without signup | ✅ Live |
| No user tracking | Privacy-respecting analytics only | ✅ Live |
| Mobile-responsive | Works on all screen sizes | ✅ Live |
| Open source | AGPL-3.0 license | ✅ Live |

---

## Phase 2 features (Q3–Q4 2026)

### Education enhancements

| Feature | Description | Priority |
| --- | --- | --- |
| Community submissions | Form to suggest new resources | High |
| Changelog page | Track database updates publicly | Medium |
| Broken link checker | Automated link health monitoring | High |
| More privacy resources | Expand Monero & Bitcoin privacy catalog | High |
| NFT PFP collection | Community identity and fundraising | Medium |

### Interactive learning (web)

| Feature | Description | Priority |
| --- | --- | --- |
| Wallet connection | Connect Solana/Bitcoin wallet for exercises | High |
| Progress tracking | Track completed resources and paths | High |
| Learning streaks | Daily study streak counter | Medium |
| User feedback loops | In-page feedback on resources | Medium |

---

## Phase 3 features (2027)

### Onchain learning

| Feature | Description | Priority |
| --- | --- | --- |
| Onchain quizzes | Answer quiz → verifiable onchain record | High |
| Soulbound certificates | Free completion certificates as SBTs on Solana | High |
| Onchain simulations | Safe exercises (testnet/devnet) | Medium |
| Badge system | Achievement badges for milestones | Medium |
| Optional leaderboards | Privacy-respecting opt-in rankings | Low |

### Discovery improvements

| Feature | Description | Priority |
| --- | --- | --- |
| RSS/Atom feed | New resource notifications | Medium |
| JSON/CSV export | Download catalog data | Medium |
| Improved path builder | Custom learning path creation | Medium |
| Contributor credits | Attribution for submitted resources | Medium |
| Nostr integration | Decentralized update notifications | Medium |

---

## Phase 4 features (2027+)

### Ecosystem tools

| Feature | Description | Priority |
| --- | --- | --- |
| Public API | REST/GraphQL for developers | Medium |
| Community curation workflow | Decentralized resource review | Medium |
| Static archive dumps | Mirror-friendly data exports | Low |
| Utility token exploration | Community points system (post-traction) | Low |

### Seeker dApp features

| Feature | Description | Priority |
| --- | --- | --- |
| Android native shell | Lightweight wrapper for Seeker | High (when ready) |
| Seed Vault integration | Biometric key management | High |
| Mobile Wallet Adapter | Seamless Solana wallet connect | High |
| Offline content cache | Study without connectivity | Medium |
| Push notifications | Study reminders (opt-in) | Low |
| Seeker Spotlight submission | Ecosystem visibility program | Medium |

---

## Feature priority matrix

```
Impact
                    High │  Wallet connect     Onchain certs
                         │  Community submit   Broken link check
                         │  Progress tracking  Seeker dApp
                    ─────┼──────────────────────────────
                    Low  │  Leaderboards       Utility token
                         │  Push notifications Archive dumps
                         └──────────────────────────────────
                              Low          Effort          High
```

---

## Gamification design principles

When gamification features are added, they must follow these rules:

1. **Opt-in only** — never require wallet connection to browse
2. **Privacy-respecting** — no real-name leaderboards
3. **Educational value** — badges reward learning, not engagement metrics
4. **Free forever** — certificates and badges cost nothing
5. **Sovereign** — users own their onchain progress data