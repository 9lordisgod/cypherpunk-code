# Fork Guide — Build Your Own Cypherpunk Code

This guide helps developers fork [cypherpunk-code](https://github.com/9lordisgod/cypherpunk-code), self-host the platform, and extend it using the project's phased roadmap.

The original site at **cypherpunk-code.com has been retired**. This repository is the canonical source.

Curator shout-out: [@CHxmrBrother](https://x.com/CHxmrBrother) on X.

---

## 1. Fork & deploy (30 minutes)

### Step 1 — Fork the repo

```bash
# GitHub UI: Fork → 9lordisgod/cypherpunk-code
git clone https://github.com/YOUR_USER/cypherpunk-code.git
cd cypherpunk-code
npm install
cp .env.example .env.local
npm run db:push
npm run dev
```

### Step 2 — Customize site metadata

Edit `src/data/site.json`:

- `name`, `tagline`, `description`
- `creator.handle` and `contact.x.handle` (your X handle)
- `donations.bitcoin` / `donations.monero` (optional — leave empty to hide)
- `repository` (your fork URL)

### Step 3 — Set production URL

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
npm start
```

Deploy to Vercel, Railway, a VPS, or any Node.js host. SQLite works for small instances; Turso/libSQL scales better.

### Step 4 — Verify UI against demos

Compare your deployment to [`demo/screenshots/`](../demo/screenshots/README.md).

**Prompt for your AI assistant:**

> I forked the Cypherpunk Code repo (Next.js 16, Prisma, Tailwind). Help me deploy it to [Vercel / my VPS] with `NEXT_PUBLIC_SITE_URL` set to my domain. Walk through env vars, database choice (SQLite vs Turso), and a post-deploy checklist against the demo screenshots in `demo/screenshots/`.

---

## 2. Phase roadmap — what to build next

The full phased roadmap with copy-paste prompts lives in:

| File | Contents |
| --- | --- |
| [`docs/roadmap/forward-steps.md`](roadmap/forward-steps.md) | Phase 1–3 feature roadmap (Codex, quizzes, Nostr, badges, self-hosting) |
| [`docs/roadmap/wiki-codex-gameplan.md`](roadmap/wiki-codex-gameplan.md) | Wiki.js Codex implementation — 8 steps with exact Grok/AI prompts |

### Recommended build order for forks

1. **Deploy a working fork** (this guide, §1)
2. **Launch Cypherpunk Codex / Wiki** — highest leverage; see wiki-codex-gameplan
3. **Client-side progress tracking** — localStorage on `/paths`
4. **Interactive quizzes** — 2–3 paths first
5. **Nostr login** — optional, NIP-07
6. **Community curation** — submission form + moderation queue

---

## 3. Copy-paste prompts by phase

Use these with Grok, Claude, Cursor, or any coding assistant. Reference this repo and the two roadmap files.

### Phase 1A — Cypherpunk Codex (Wiki.js)

> I'm extending my fork of Cypherpunk Code (Next.js app at `https://github.com/9lordisgod/cypherpunk-code`). Read `docs/roadmap/wiki-codex-gameplan.md` Step 1. Help me set up a clean Git repository structure for a Wiki.js instance that will power the Cypherpunk Codex. Pages stored as Markdown. Suggest folder structure, `.gitignore`, initial README, and exact GitHub repo creation steps.

### Phase 1B — Wiki.js Docker deploy

> Read `docs/roadmap/wiki-codex-gameplan.md` Step 2. Give me a clean, minimal `docker-compose.yml` to run the latest Wiki.js with PostgreSQL. Include environment variables, volumes, ports. Production-ready but simple. Explain each part.

### Phase 1C — Proxy `/codex` to Wiki.js

> I run my Cypherpunk Code fork behind Nginx at `[my-domain]`. Read `docs/roadmap/wiki-codex-gameplan.md` Step 4. Give me the exact Nginx `location` block to proxy `/codex` to a Docker Wiki.js container on port 3000. Include WebSocket handling if needed.

### Phase 1D — Client-side progress on learning paths

> In my Cypherpunk Code fork, add client-side progress tracking on `/paths` using localStorage. No auth. Users mark steps complete; show progress bars and completion percentages. Add "Continue where you left off" on the homepage. Match existing Tailwind design in `src/components/PathsContent.tsx`. Write tests.

### Phase 1E — Interactive quizzes (2 paths)

> Read `docs/roadmap/forward-steps.md` item 3. Add short quizzes after key sections in the Cypherpunk Foundations and Practical OpSec paths. Client-side only. Simple verification challenges (e.g. GPG steps checklist). Unlock next step preview on completion. Integrate with existing path data in `src/data/paths.json`.

### Phase 1F — Quote / meme generator

> Read `docs/roadmap/forward-steps.md` item 4. Build a `/tools/quote-generator` page in my Cypherpunk Code fork: user selects or inputs a cypherpunk quote → generates a shareable branded image. Include export for X/Nostr. Use existing design tokens from `src/app/globals.css`.

### Phase 1G — Nostr login (optional)

> Read `docs/roadmap/forward-steps.md` item 5. Add optional "Sign in with Nostr" (NIP-07) to my fork. Logged-in users post short learning reflections. Display a simple "Recent Signals" feed. Keep fully optional — no required accounts. Privacy-first.

### Phase 2 — Badges & verifiable credentials

> Read `docs/roadmap/forward-steps.md` Phase 2 (items 7–9). Design a badge system for completed learning paths in my Cypherpunk Code fork. Start with client-side badges; plan Nostr-verifiable attestations later. Non-transferable, sovereignty-aligned. No trading/token hype.

### Phase 3 — Self-hostable package & governance

> Read `docs/roadmap/forward-steps.md` Phase 3 (items 12–13). Package catalog data + static site generator so others can run their own instance. Write `docs/SELF_HOST.md` with Docker, env vars, and mirror instructions. Open `resources.json` and `paths.json` under AGPL-3.0.

---

## 4. Principles for every fork

From `docs/roadmap/forward-steps.md`:

- **No trading noise** — CP Score filter stays central
- **Sovereignty first** — optional accounts, self-hostable, Nostr preferred
- **Privacy first** — minimal data collection, local-first where possible
- **Quality over quantity** — every feature must increase signal
- **Fun without dilution** — gamification reinforces cypherpunk culture

---

## 5. Catalog & content

| File | Edit to… |
| --- | --- |
| `src/data/resources.json` | Add/remove curated resources |
| `src/data/paths.json` | Reorder or create learning paths |
| `src/data/i18n/*.json` | Translate resource metadata |
| `docs/` | Update mission, FAQ, roadmap copy |

Run `npm run audit:catalog` after URL changes.

**Prompt:**

> I forked Cypherpunk Code. Help me add a new resource to `src/data/resources.json` with correct schema (id, title, url, type, topics, difficulty, pricing, cpScore, featured). Validate the URL passes `scripts/audit-catalog-urls.mjs`. Suggest which learning path in `paths.json` should reference it.

---

## 6. Get help & shout out

- **Curator:** [@CHxmrBrother](https://x.com/CHxmrBrother)
- **Issues:** [GitHub Issues](https://github.com/9lordisgod/cypherpunk-code/issues)
- **Security:** [SECURITY.md](../SECURITY.md)

*"Cypherpunks write code."* — keep building the signal.