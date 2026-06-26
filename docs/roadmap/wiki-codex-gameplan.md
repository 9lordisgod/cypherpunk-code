# Wiki.js Codex Implementation Game Plan

Date: June 25, 2026  
Goal: Add a high-quality **Cypherpunk Codex** (living encyclopedia / wiki) at `/codex` on your fork  
Tool: Wiki.js (chosen as best long-term option)  
Approach: Keep It Simple Stupid (KISS)  
Philosophy: Start restrictive, high-signal, manual moderation. Content stays in Git.

> Use with: [`forward-steps.md`](forward-steps.md) item 1 and [`../FORK_GUIDE.md`](../FORK_GUIDE.md)

---

## Why this matters

The Codex is the #1 highest-leverage feature to make Cypherpunk Code more fun, interesting, and sticky. It turns the site from "curated list of links" into a real destination with rabbit holes, deep knowledge, and community potential.

---

## High-level architecture (KISS)

- **Main site:** Your Next.js fork (this repo)
- **Codex:** Separate Wiki.js instance in Docker
- **URL:** `https://your-domain.example/codex` (or `codex.your-domain.example`)
- **Storage:** Git repository (bi-directional sync) → Markdown files, version history
- **Auth:** Wiki.js built-in accounts (restrictive). Later: Nostr login
- **Moderation:** Manual review queue first

---

## Step-by-step game plan

### Step 1 — Prepare Git repository for content

Create a public Git repo (e.g. `cypherpunk-codex-content`) for wiki pages as Markdown.

**Ready-to-use prompt:**

> Help me set up a clean Git repository structure for a Wiki.js instance that will power the Cypherpunk Codex. I want pages stored as Markdown. Suggest a good folder structure, `.gitignore`, and initial README. Also give me the exact steps to create the repo on GitHub and initialize it locally.

---

### Step 2 — Deploy Wiki.js with Docker

Use official Docker setup on your VPS or cloud host. One `docker-compose.yml`.

**Ready-to-use prompt:**

> Give me a clean, minimal `docker-compose.yml` file to run the latest Wiki.js with PostgreSQL database. Include environment variables, volumes, and ports. Make it production-ready but simple. Also add a short explanation of each part.

---

### Step 3 — Configure Git storage backend (bi-directional sync)

Connect Wiki.js admin → Git storage module → your content repo.

**Ready-to-use prompt:**

> Walk me through configuring the Git storage backend in Wiki.js step by step. I have a GitHub repo ready. Include: how to generate SSH key if needed, exact settings in the Wiki.js admin panel, sync direction, and how to test that changes flow both ways. Keep it simple.

---

### Step 4 — Make Codex accessible at `/codex`

Add reverse proxy rule (Nginx, Caddy, or Traefik) in front of your Next.js app.

**Ready-to-use prompt:**

> I run a Next.js app on `[my-domain]` behind Nginx. Give me the exact Nginx `location` block (or Caddy equivalent) to proxy `/codex` to a Docker container running Wiki.js on port 3000. Also show how to handle WebSocket if needed for real-time editing. Keep the config clean and minimal.

---

### Step 5 — Set up restrictive permissions

Admin + small moderator group only. Viewers read; suggestions via form.

**Ready-to-use prompt:**

> Explain the simplest way to set up restrictive permissions in Wiki.js so that: only I (admin) and a small group of moderators can create and edit pages. Normal logged-in users can only read and submit suggestions via a form or comments. Give me the exact steps in the admin panel and any recommended group/role settings.

---

### Step 6 — Simple moderation / approval system (KISS)

Manual review: users suggest via X/Nostr/form; you publish in Wiki.js.

**Ready-to-use prompt:**

> Design a simple manual moderation workflow for the Cypherpunk Codex on Wiki.js. Users should not be able to edit directly at first. They can suggest changes. I review and publish. Give me: 1) How to set this up in Wiki.js permissions, 2) A simple suggestion form idea, 3) My review process checklist to keep quality high (similar to CP Score thinking).

---

### Step 7 — Seed initial content + connect to existing site

Write 6–10 core articles. Link to learning paths and catalog.

**Ready-to-use prompt:**

> Help me plan and outline the first 8 high-signal articles for the Cypherpunk Codex. Each article should be educational, link back to existing learning paths and catalog resources where possible, and create rabbit holes. Suggest titles + short descriptions + key internal links. Keep the tone serious, clear, and cypherpunk.

Suggested starters:

- Cypherpunk history & mailing list era
- Key figures (Eric Hughes, Tim May, Hal Finney)
- Threat modeling frameworks
- Cryptographic primitives
- Practical OpSec living document

---

### Step 8 — Basic polish & fun touches

Landing page at `/codex`, links from homepage and paths.

**Ready-to-use prompt:**

> Now that the Codex is running, give me ideas and implementation steps to make it more engaging: nice intro page, cross-links from learning paths, simple "Continue learning in the Codex" buttons, and optional Nostr share buttons on articles. Keep everything lightweight.

---

## Moderation algorithm (keep simple)

**Phase 1 (now):** Manual review. Wiki.js revision history + diff. Timestamp automatic.

**Phase 2 (later):** Daily link checker cron. Optional OpenTimestamps on important pages.

Rule: Protect signal quality above all. Manual review is a feature, not a bug.

---

## How this fits the bigger roadmap

| Layer | Feature |
| --- | --- |
| Foundation | Codex (this doc) |
| Next | Progress tracking + badges referencing Codex articles |
| Then | Nostr integration, interactive challenges |
| Later | Community suggestions → moderated Codex growth |

---

## Final KISS rules

- Start restrictive. Open up slowly.
- Content must stay high-signal (CP Score thinking).
- Everything in Git → fork-friendly.
- Don't over-engineer moderation on day one.
- Ship the first 5–6 articles even if imperfect.

---

## Next immediate actions

1. Create the Git content repo (Step 1 prompt)
2. Deploy Wiki.js with Docker (Step 2 prompt)
3. Configure Git sync (Step 3 prompt)
4. Proxy `/codex` (Step 4 prompt)
5. Seed 2 test pages, then real content (Step 7 prompt)

Shout-out: [@CHxmrBrother](https://x.com/CHxmrBrother)