/**
 * Keep /out/branding in sync with /public/branding when a static /out tree exists.
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicBranding = join(root, "public", "branding");
const outBranding = join(root, "out", "branding");

if (!existsSync(join(root, "out"))) {
  console.log("sync-out-branding: no /out directory — skipped");
  process.exit(0);
}

if (!existsSync(publicBranding)) {
  console.log("sync-out-branding: no public/branding — skipped");
  process.exit(0);
}

if (existsSync(outBranding)) {
  rmSync(outBranding, { recursive: true, force: true });
}

cpSync(publicBranding, outBranding, { recursive: true });
console.log("sync-out-branding: synced public/branding → out/branding");