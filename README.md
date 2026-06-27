<div align="center">

<img src=".github/app-icon-box.png" alt="Cypherpunk Code" width="96" />

# Cypherpunk Code

**Learn freedom. Skip the trading noise.**

A curated freedom education index for Bitcoin, Monero, cryptography, and cypherpunk sovereignty.

<br />

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9lordisgod%2Fcypherpunk-code&project-name=cypherpunk-code&env=NEXT_PUBLIC_SITE_URL&envDescription=Your%20public%20deployment%20URL%20(required%20for%20SEO%20and%20canonical%20links)&envLink=https%3A%2F%2Fgithub.com%2F9lordisgod%2Fcypherpunk-code%23quick-start"><img src="https://vercel.com/button" alt="Deploy with Vercel" height="20" /></a>



</div>

<br />

The original site at [cypherpunk-code.com](https://www.cypherpunk-code.com) has been retired. **This repository is the canonical source** — fork it, self-host it, and run your own index.

---

## Overview

| | |
| --- | --- |
| **68** curated resources | Papers, guides, docs, manifestos |
| **6** learning paths | Philosophy → Bitcoin → Monero → OpSec |
| **4** languages | EN · FR · JA · 中文 |
| **CP Score** | Editorial filter against trading noise |

Built with Next.js 16, Tailwind CSS, and JSON-first catalog data. No accounts required to browse.

---

## Preview

<p align="center">
  <img src="demo/screenshots/01-homepage.png" alt="Homepage" width="32%" />
  <img src="demo/screenshots/02-catalog.png" alt="Catalog" width="32%" />
  <img src="demo/screenshots/03-paths.png" alt="Learning paths" width="32%" />
</p>

<p align="center">
  <sub>More in <a href="demo/screenshots/">demo/screenshots</a> · desktop &amp; mobile</sub>
</p>

---

## Quick start

```bash
git clone https://github.com/9lordisgod/cypherpunk-code.git
cd cypherpunk-code
npm install
cp .env.example .env.local
npm run db:push
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

### Deploy

Fork the repo, then use **Deploy with Vercel** above. Set one env var:

| Variable | Example |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` |

Customize `src/data/site.json` for your handle, contact link, and optional donation addresses.

The catalog runs from `src/data/*.json` — no database required. For feedback and analytics on serverless, optionally add [Turso](https://turso.tech) (`DATABASE_URL`, `DATABASE_AUTH_TOKEN`).

---

## Extend

| Guide | What it covers |
| --- | --- |
| [Fork Guide](docs/FORK_GUIDE.md) | Deploy, customize, contribute |
| [Forward Steps](docs/roadmap/forward-steps.md) | Phased roadmap with AI prompts |
| [Wiki Codex Plan](docs/roadmap/wiki-codex-gameplan.md) | Encyclopedia via Wiki.js |

---

## Contributing

Pull requests welcome.

- [Contributing](docs/CONTRIBUTING.md) · [Security](SECURITY.md) · [Documentation](docs/)
- [Suggest a resource](https://github.com/9lordisgod/cypherpunk-code/issues/new?template=resource-suggestion.yml) · [Report a broken link](https://github.com/9lordisgod/cypherpunk-code/issues/new?template=broken-link.yml)

---

## License

[GNU Affero General Public License v3.0](LICENSE)
