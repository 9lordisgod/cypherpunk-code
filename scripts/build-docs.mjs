import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const docsDir = join(root, "docs");
const buildDir = join(docsDir, "_book");
const publicDir = join(root, "public", "doc");

console.log("Building GitBook documentation...");

execSync("npx honkit build", {
  cwd: docsDir,
  stdio: "inherit",
});

if (existsSync(publicDir)) {
  rmSync(publicDir, { recursive: true, force: true });
}

cpSync(buildDir, publicDir, { recursive: true });

console.log(`\nDocumentation built → public/doc/`);
console.log("Preview: npm run docs:dev (port 4000) or npm run dev (port 3000/doc/)");