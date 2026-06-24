/**
 * Keep /out/branding in sync with /public/branding when a static /out tree exists.
 */
import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicBranding = join(root, "public", "branding");
const outBranding = join(root, "out", "branding");

if (!existsSync(join(root, "out"))) {
  console.log("sync-out-branding: no /out directory — skipped");
  process.exit(0);
}

if (!existsSync(publicBranding)) {
  console.error("sync-out-branding: missing public/branding");
  process.exit(1);
}

if (existsSync(outBranding)) {
  rmSync(outBranding, { recursive: true, force: true });
}

cpSync(publicBranding, outBranding, { recursive: true });

const stale = ["unisat.svg", "xverse.svg"];
const walletDir = join(outBranding, "wallets");
const files = existsSync(walletDir) ? readdirSync(walletDir) : [];
const foundStale = stale.filter((name) => files.includes(name));

if (foundStale.length > 0) {
  console.error(`sync-out-branding: stale wallet assets still present: ${foundStale.join(", ")}`);
  process.exit(1);
}

console.log("sync-out-branding: synced public/branding → out/branding");
console.log("sync-out-branding: wallets:", files.join(", "));