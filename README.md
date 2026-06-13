# Cypherpunk Code

Open education index for Bitcoin, Monero, and cypherpunk sovereignty.

**Domain:** [cypherpunk-code.ca](https://cypherpunk-code.ca)

Curated by [@CHxmrBrother](https://x.com/CHxmrBrother).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Works on Vercel, Cloudflare Pages, or any Node host:

```bash
npm run build
npm start
```

Static export is possible later if you drop client-side search (currently uses React state).

## Customize

| File | Purpose |
|------|---------|
| `src/data/resources.json` | Resource database (58 entries seeded) |
| `src/data/paths.json` | Learning path sequences |
| `src/data/site.json` | Site name, creator handle, donation addresses |

Site name, domain, and donation addresses are configured in `site.json`.

## Arena (on-chain devnet play)
The arena uses real devnet transactions for token consumption during play.

Environment variables (NEXT_PUBLIC_* so they are bundled to client):

- `NEXT_PUBLIC_HELIUS_API_KEY` — Preferred. If set, arena + wallet uses `https://devnet.helius-rpc.com/?api-key=...` for better reliability during `sendTransaction` + `confirmTransaction`.
- `NEXT_PUBLIC_SOLANA_RPC_URL` — Full override (takes precedence).
- (Legacy placeholder) `NEXT_PUBLIC_TREASURY_FUSE` — Not actively used in current devnet burn flow (burns are direct; transfer-to-treasury is easy future swap in `burnDevnetUsdc`).

To use Helius: sign up at helius.dev (free tier sufficient for devnet testing), create key with devnet access, set the env var, `npm run dev`.

Without it the app falls back to `clusterApiUrl('devnet')` (public, works but less consistent for rapid successive burns).

## Pages

- `/` — Homepage with featured resources
- `/catalog` — Searchable, filterable catalog with CP Score
- `/paths` — Curated learning paths
- `/resource/[id]` — Resource detail pages
- `/about` — About + donation info
- `/roadmap` — Project roadmap
- `/arena` — Cipher Arena: connect Phantom (Solana devnet), play the poker hand. COMMIT/ESCALATE actions perform real devnet USDC burns (tx + sig). Hand resolution and settlement are local simulation of Race Protocol. Get test USDC: https://faucet.circle.com/

  Recommended for reliable txs while playing: set `NEXT_PUBLIC_HELIUS_API_KEY` (or full `NEXT_PUBLIC_SOLANA_RPC_URL`) in `.env.local` / Vercel env. Public cluster RPC works but can be slow/rate-limited for interactive burns.

## Adding resources

Add entries to `resources.json` following the schema in `src/lib/types.ts`. Rebuild to publish.

## License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

See the [LICENSE](LICENSE) file for details.

This means:
- You are free to use, modify, and distribute the code.
- If you run a modified version as a network service (e.g. a hosted version of the site or Arena), you must make the corresponding source available to users.
- The license ensures the project remains open and aligned with cypherpunk principles of transparency and sovereignty.

## Security

If you discover a security vulnerability, please report it responsibly. See `SECURITY.md` (or open an issue with details if no file exists yet).