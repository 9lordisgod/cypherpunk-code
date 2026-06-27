# Contributing to Cypherpunk Code

Thank you for helping build high-signal freedom education tooling.

This repository is open source under [AGPL-3.0](https://github.com/9lordisgod/cypherpunk-code/blob/main/LICENSE). Pull requests are welcome.

---

## Quick links

| Guide | What you'll find |
| --- | --- |
| [Fork Guide](FORK_GUIDE.md) | Deploy your own instance, customize metadata, and extend the platform |
| [Forward Steps Roadmap](roadmap/forward-steps.md) | Phased features with copy-paste AI prompts |
| [Wiki Codex Game Plan](roadmap/wiki-codex-gameplan.md) | Encyclopedia implementation via Wiki.js |
| [Openness Policy](doc/openness-policy.md) | Transparency commitments and data-layer roadmap |
| [Platform Security](reference/security.md) | Headers, catalog policy, vault, and link safety |
| [Security policy (repo)](https://github.com/9lordisgod/cypherpunk-code/blob/main/SECURITY.md) | Vulnerability reporting and responsible disclosure |

---

## Development setup

```bash
git clone https://github.com/9lordisgod/cypherpunk-code.git
cd cypherpunk-code
npm install
cp .env.example .env.local
npm run db:push
npm run dev
```

Review [`.env.example`](https://github.com/9lordisgod/cypherpunk-code/blob/main/.env.example) for optional settings. Open [http://localhost:3000](http://localhost:3000) after `npm run dev`.

**Deploy in one click:** use **Deploy with Vercel** in the [README](https://github.com/9lordisgod/cypherpunk-code#quick-start), then set `NEXT_PUBLIC_SITE_URL` to your deployment URL. Full walkthrough: [Fork Guide → Step 3](FORK_GUIDE.md#step-3--set-production-url).

---

## Documentation

Official docs live in [`docs/`](https://github.com/9lordisgod/cypherpunk-code/tree/main/docs) and are built with [Honkit](https://github.com/honkit/honkit) (GitBook-compatible).

```bash
npm run docs:dev    # Preview at http://localhost:4000
npm run docs:build  # Output to public/doc/ → served at /doc/
```

On a running fork, open **`/doc/`** (e.g. [http://localhost:3000/doc/](http://localhost:3000/doc/) after `npm run dev`).

### Structure

| File / folder | Purpose |
| --- | --- |
| [README.md](README.md) | Docs welcome page |
| [SUMMARY.md](https://github.com/9lordisgod/cypherpunk-code/blob/main/docs/SUMMARY.md) | Sidebar navigation |
| `doc/` | Mission, platform guide, roadmap — [How to Study](doc/how-to-study.md) · [Platform Guide](doc/platform-guide.md) · [Mission & Values](doc/mission.md) · [Openness Policy](doc/openness-policy.md) · [Project Roadmap](doc/roadmap.md) |
| `reference/` | CP Score, paths, FAQ, glossary — [Cypherpunk Score](reference/cypherpunk-score.md) · [Learning Paths](reference/learning-paths.md) · [FAQ](reference/faq.md) · [Glossary](reference/glossary.md) · [Platform Security](reference/security.md) |
| `roadmap/` | Forward steps + Wiki.js Codex — [Forward Steps](roadmap/forward-steps.md) · [Wiki Codex Game Plan](roadmap/wiki-codex-gameplan.md) |
| [FORK_GUIDE.md](FORK_GUIDE.md) | Fork, deploy, extend |

### Adding a page

1. Create the markdown file under `docs/`
2. Add an entry to [`SUMMARY.md`](https://github.com/9lordisgod/cypherpunk-code/blob/main/docs/SUMMARY.md)
3. Preview with `npm run docs:dev`
4. Ship with `npm run docs:build`

---

## Pull requests

1. [Fork](https://github.com/9lordisgod/cypherpunk-code/fork) the repo and branch from `main`
2. Keep changes focused — one feature or fix per PR
3. Run `npm test` and `npm run lint`
4. Update docs if behavior or config changes
5. For catalog edits, run `npm run audit:catalog` before opening the PR

---

## Editorial guidelines

- Align with the [cypherpunk mission](doc/mission.md): privacy, sovereignty, cryptography
- No trading noise, no hype, no paywall language — see [Openness Policy](doc/openness-policy.md)
- All education content must remain **100% free**

---

## Suggesting resources

Use the **[Resource suggestion](https://github.com/9lordisgod/cypherpunk-code/issues/new?template=resource-suggestion.yml)** issue template.

Before submitting, search the [catalog data](https://github.com/9lordisgod/cypherpunk-code/blob/main/src/data/resources.json) for duplicates.

For broken links, use the **[Broken link report](https://github.com/9lordisgod/cypherpunk-code/issues/new?template=broken-link.yml)** template.

Browse [open issues](https://github.com/9lordisgod/cypherpunk-code/issues) for existing requests.

---

## Security

**Report vulnerabilities responsibly** — do not open public issues for exploitable bugs.

| Channel | Link |
| --- | --- |
| Private advisory (preferred) | [GitHub Security Advisories](https://github.com/9lordisgod/cypherpunk-code/security/advisories/new) |
| Full policy | [SECURITY.md](https://github.com/9lordisgod/cypherpunk-code/blob/main/SECURITY.md) |
| Platform hardening docs | [Platform Security](reference/security.md) |

Include a description, reproduction steps, and potential impact. We aim to acknowledge within 48 hours.

---

## Questions?

- [GitHub Issues](https://github.com/9lordisgod/cypherpunk-code/issues)
