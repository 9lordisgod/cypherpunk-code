# Forward Steps & Action Roadmap

Created: June 25, 2026  
Project: [Cypherpunk Code](https://github.com/9lordisgod/cypherpunk-code)  
Status: **Open source** — fork, self-host, and extend

## Mission reminder

> Learn freedom. Skip the trading noise.

Focus: High-signal curation, sovereignty, privacy, cypherpunk philosophy.  
Goal: Evolve from excellent reference library → interactive cypherpunk academy + living knowledge commons + sovereign community hub.

---

## Phase 1: Immediate (4–8 weeks) — Quick wins & foundation

- [ ] **1. Launch Cypherpunk Codex / Wiki section** (highest priority)
  - Create `/codex` or `/wiki` route
  - Write 8–10 core interconnected articles
  - Add internal linking + "related concepts" navigation
  - Start read-only; plan for future community editing
  - **Prompt:** See [`wiki-codex-gameplan.md`](wiki-codex-gameplan.md)

- [ ] **2. Client-side progress tracking** (no auth initially)
  - localStorage to mark path steps complete
  - Progress bars on `/paths`
  - "Continue where you left off" on homepage

- [ ] **3. Interactive quizzes & challenges** (2–3 core paths first)
  - Short quizzes after key sections
  - Verification challenges (GPG, Tor config checks)
  - "Build Your Cypherpunk Toolkit" checklist

- [ ] **4. Cypherpunk quote / meme generator**
  - User inputs quote → shareable branded image
  - Nostr/X export buttons

- [ ] **5. Nostr login + basic reflection posting**
  - "Sign in with Nostr" (NIP-07)
  - Short learning reflections feed
  - Fully optional for privacy

- [ ] **6. UX / content polish**
  - Mobile responsiveness
  - Clear CTAs: "Start Cypherpunk Foundations Path", "Explore the Codex"
  - Donation addresses and X/Nostr links (configure in `site.json`)

---

## Phase 2: Medium term (with auth / wallet sign-in)

- [ ] **7. Full account-based progress + badges**
- [ ] **8. Verifiable credentials** (soulbound or Nostr attestations)
- [ ] **9. Nostr-powered community features**
- [ ] **10. Community resource suggestion UI**
- [ ] **11. Enhanced gamification** (opt-in, privacy-respecting)

---

## Phase 3: Longer term

- [ ] **12. Community curation & governance layer**
- [ ] **13. Self-hostable version of the platform**
- [ ] **14. Seeker dApp & onchain roadmap** (privacy-preserving only)
- [ ] **15. Optional utility token** — only if clear non-speculative use case; prefer reputation + donations

---

## Ongoing / evergreen

- Maintain & expand catalog (aim for 100+ high-CP resources)
- Update learning paths from feedback
- Regular X/Nostr posting — anti-noise, pro-code voice
- Security & privacy reviews as auth features launch
- Coordinate with Nostr and crypto/AI projects for synergies

---

## Key principles

- Stay on-mission: no trading noise, no hype, no KYC-heavy features
- Prioritize sovereignty: Nostr login, optional accounts, self-hostable future
- Privacy first: minimal data collection, local-first where possible
- Quality over quantity: every feature must increase signal
- Fun without dilution: gamification reinforces cypherpunk culture

---

## Success metrics

- Path completion rates
- Time on site / per path
- Codex article views & internal link clicks
- Nostr reflection posts & community engagement
- Resource suggestion volume & quality
- Repeat visitors & returning learners
- External mentions in cypherpunk, Bitcoin, Monero communities

---

## Exact prompts for AI assistants

Copy these when working on each item. Full context: [`../FORK_GUIDE.md`](../FORK_GUIDE.md).

### Item 1 — Codex

> Help me implement the Cypherpunk Codex for my fork of Cypherpunk Code. Read `docs/roadmap/wiki-codex-gameplan.md` and execute Step 1: set up a Git repository structure for Wiki.js with Markdown pages, folder layout, `.gitignore`, and README.

### Item 2 — Progress tracking

> In my Cypherpunk Code fork (`src/components/PathsContent.tsx`, `src/data/paths.json`), add localStorage-based progress tracking. Progress bars per path, completion percentage, and "Continue where you left off" on the homepage. No auth. Match existing UI.

### Item 3 — Quizzes

> Add client-side quizzes to the Cypherpunk Foundations and Practical OpSec paths in my Cypherpunk Code fork. After manifesto and OpSec intro sections. Simple checklist verification. Show badge preview on completion.

### Item 4 — Quote generator

> Build `/tools/quote-generator` in my Cypherpunk Code Next.js fork. Select famous cypherpunk quotes or custom text → canvas-rendered shareable image with branding. Export buttons for X and Nostr.

### Item 5 — Nostr login

> Add optional NIP-07 Nostr login to my Cypherpunk Code fork. Users post short "learning reflections." Display curated recent notes feed. No required accounts. Privacy-first implementation.

### Item 6 — UX polish

> Review my Cypherpunk Code fork against `demo/screenshots/`. Improve mobile nav, add homepage CTAs linking to `/paths#cypherpunk-foundations` and future `/codex`. Keep cypherpunk aesthetic from `globals.css`.

---

*"Cypherpunks write code."* — Keep building the signal.

Shout-out: [@CHxmrBrother](https://x.com/CHxmrBrother)