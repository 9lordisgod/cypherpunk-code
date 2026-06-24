# Openness Policy

How Cypherpunk Code balances transparency with a private codebase during early development.

> We teach sovereignty and verifiability. This policy explains what is open today, what stays private for now, and what opens next — without overpromising a full open-source date.

---

## Bottom line

**The application codebase is closed source at this stage — and that is intentional.**

Cypherpunk Code is an early-stage project with auth, wallet sign-in, admin tooling, and production infrastructure still maturing. Keeping the implementation private while we stabilize security and architecture is the right call for now.

**The risk is not being private. The risk is staying private too long without compensating transparency** — especially as wallet features and community curation go live.

This policy is our commitment to open the parts that matter first.

---

## What is open today

| Layer | Status | Where |
| --- | --- | --- |
| The live platform | Open | [cypherpunk-code.com](https://cypherpunk-code.com) — free to browse, no accounts required |
| Mission, values, and roadmap | Open | [DOC](/doc/) |
| Editorial philosophy (CP Score) | Open | [Cypherpunk Score](/doc/reference/cypherpunk-score.html) |
| Security reporting process | Open | [Platform Security](/doc/reference/security.html) |
| How to contribute suggestions | Open | [About](/about#contact) — resources, broken links, feedback |

Learners do not need access to our repository to use the archive. The education layer is public.

---

## What stays private (for now)

| Layer | Why |
| --- | --- |
| Application source code | Auth, admin, rate limiting, and deployment are still evolving |
| Infrastructure and secrets | Standard operational security |
| Unfinished product strategy | Seeker dApp and onchain roadmap details stay internal until ready |

The repository is **private and proprietary**. We do not accept public pull requests, forks, or redistribution of the codebase at this stage.

---

## How we will open — data first, code second

We will not flip a single “open source everything” switch. Openness will roll out in layers, tied to real milestones.

### Trigger: Q3 2026 (Phase 2)

When we ship the **resource submission form** and begin formal community curation, we will **publish the catalog data layer** under an open license:

- `resources.json` — curated resource database
- `paths.json` — learning path sequences
- `site.json` — public site metadata (name, handles, donation addresses)

This is the highest-leverage transparency step: the editorial work — CP Scores, paths, and catalog structure — becomes independently verifiable and mirrorable without exposing auth or admin internals.

### After the data layer

Application code will open in stages as features stabilize:

1. **Wallet and progress features** — once auth paths are reviewed and hardened
2. **Catalog tooling** — export scripts, link checkers, submission workflows
3. **Core platform** — when architecture is stable enough to welcome maintainers

We are **not** committing to a specific date for full application open source. We *are* committing to this order: **public data and docs before private implementation details**.

See [Project Roadmap](roadmap.md) for milestone timing.

---

## Why this order

| Principle | How we apply it |
| --- | --- |
| Code is speech | We index tools that empower self-hosting; our catalog data should be freely reusable |
| Sovereignty over convenience | Learners and mirrors should not depend on our deployment alone |
| Security | Opening half-baked auth/admin code helps attackers more than users |
| Editorial focus | The catalog *is* the public good; the Next.js app is how we serve it today |

---

## How you can help without repo access

- **Suggest a resource** — URL and why it belongs in the catalog
- **Report a broken link** — resource name and what happens when you click
- **Share feedback** — catalog, courses, paths, or documentation ideas
- **Spread the word** — share paths and resources with learners

Contact [@sapherpunk](https://x.com/sapherpunk) on X or use the [contact section](https://cypherpunk-code.com/about#contact).

---

## Licensing (planned)

| Asset | Current | Target |
| --- | --- | --- |
| Catalog data (`resources.json`, `paths.json`, `site.json`) | Proprietary (bundled with private repo) | Open license — **from Q3 2026** |
| Documentation (`docs/`) | Proprietary (bundled with private repo) | Open license — **with or before data release** |
| Application code | Proprietary, all rights reserved | Staged open release — **date TBD** |

Licensing inquiries: [@sapherpunk](https://x.com/sapherpunk).

---

## Review

This policy will be updated when milestones are reached. Major changes will be noted on the [roadmap](roadmap.md).

*Transparency is selective revelation. We open what learners and the community need to verify — on a deliberate schedule, not as an afterthought.*