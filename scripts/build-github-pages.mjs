import { execSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const apiDir = join(root, "src/app/api");
const apiBackup = join(root, ".pages-build-api-backup");

function stashApiRoutes() {
  if (!existsSync(apiDir)) return;
  rmSync(apiBackup, { recursive: true, force: true });
  renameSync(apiDir, apiBackup);
}

function restoreApiRoutes() {
  if (!existsSync(apiBackup)) return;
  rmSync(apiDir, { recursive: true, force: true });
  renameSync(apiBackup, apiDir);
}

stashApiRoutes();

try {
  execSync("next build", {
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });
} finally {
  restoreApiRoutes();
}