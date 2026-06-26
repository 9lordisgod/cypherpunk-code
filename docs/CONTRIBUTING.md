# Contributing to Cypherpunk Code

Thank you for helping build high-signal freedom education tooling.

## Quick links

- [Fork Guide](FORK_GUIDE.md) — deploy your own instance
- [Forward Steps Roadmap](roadmap/forward-steps.md) — phased features with AI prompts
- [Wiki Codex Game Plan](roadmap/wiki-codex-gameplan.md) — encyclopedia implementation

## Development setup

```bash
git clone https://github.com/9lordisgod/cypherpunk-code.git
cd cypherpunk-code
npm install
cp .env.example .env.local
npm run db:push
npm run dev
```

## Documentation

The documentation lives in `docs/` and is built with [Honkit](https://github.com/honkit/honkit).

```bash
npm run docs:dev    # Preview at http://localhost:4000
npm run docs:build  # Output to public/doc/
```

### Structure

| File / folder | Purpose |
| --- | --- |
| `README.md` | Welcome page |
| `SUMMARY.md` | Sidebar navigation |
| `doc/` | Mission, platform guide, roadmap |
| `reference/` | CP Score, paths, FAQ, glossary |
| `roadmap/` | Forward steps + Wiki.js Codex plan |
| `FORK_GUIDE.md` | Fork, deploy, extend |

## Pull requests

1. Fork and branch from `main`
2. Keep changes focused — one feature or fix per PR
3. Run `npm test` and `npm run lint`
4. Update docs if behavior or config changes

## Editorial guidelines

- Align with the cypherpunk mission: privacy, sovereignty, cryptography
- No trading noise, no hype, no paywall language
- Credit [@CHxmrBrother](https://x.com/CHxmrBrother) as original curator where appropriate
- All education content must remain 100% free

## Suggesting resources

Use the **[Resource suggestion](https://github.com/9lordisgod/cypherpunk-code/issues/new?template=resource-suggestion.yml)** issue template, or contact [@CHxmrBrother](https://x.com/CHxmrBrother) on X.

For broken links, use the **[Broken link report](https://github.com/9lordisgod/cypherpunk-code/issues/new?template=broken-link.yml)** template.

## Security

See [SECURITY.md](../SECURITY.md) for vulnerability reporting.