# Openness Policy

How Cypherpunk Code balances transparency with sustainable development.

> We teach sovereignty and verifiability. This policy explains what is open in this repository and how forks can extend the project.

---

## Bottom line

**The full application is open source under AGPL-3.0.**

The original hosted site at cypherpunk-code.com has been **retired**. This GitHub repository is the canonical public source. Anyone may fork, self-host, modify, and deploy their own freedom education index.

---

## What is open today

| Layer | Status | Where |
| --- | --- | --- |
| Application source code | Open | This repository — `src/` |
| Catalog data | Open | `src/data/resources.json`, `paths.json`, `site.json` |
| Documentation | Open | `docs/` |
| UI reference | Open | `demo/screenshots/` |
| Fork & extension guide | Open | `docs/FORK_GUIDE.md` |
| Roadmap with AI prompts | Open | `docs/roadmap/forward-steps.md`, `wiki-codex-gameplan.md` |

Learners using a deployed fork get the full platform without needing separate data dumps.

---

## What you configure locally

| Layer | Notes |
| --- | --- |
| Deployment URL | Set `NEXT_PUBLIC_SITE_URL` in production |
| Donation addresses | Optional — edit `src/data/site.json` |
| Database | SQLite locally; Turso/libSQL for production scale |
| Security vault | Optional encrypted config — see `.env.example` |

Never commit `.env.local`, vault keys, or API tokens.

---

## How to contribute

1. Fork the repository
2. Create a feature branch
3. Open a pull request with a clear description
4. Ensure `npm test` and `npm run lint` pass

Resource suggestions and feedback: [@CHxmrBrother](https://x.com/CHxmrBrother) on X or GitHub Issues.

See [CONTRIBUTING.md](../CONTRIBUTING.md) and [FORK_GUIDE.md](../FORK_GUIDE.md).

---

## Licensing

| Asset | License |
| --- | --- |
| Application code | [AGPL-3.0](../../LICENSE) |
| Catalog data (`resources.json`, `paths.json`, `site.json`) | AGPL-3.0 (same repo) |
| Documentation (`docs/`) | AGPL-3.0 |
| Demo screenshots (`demo/`) | AGPL-3.0 |

Network-deployed modified versions must provide source to users per AGPL terms.

---

## Review

This policy is updated when major openness milestones are reached. See [Project Roadmap](roadmap.md).

*Transparency is selective revelation — we now open the full stack so the community can verify, fork, and build.*