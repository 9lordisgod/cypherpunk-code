#!/usr/bin/env node
/**
 * Static scan for malware/backdoor patterns in source code.
 * Usage: node scripts/security-scan.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const SCAN_DIRS = ["src", "scripts"];
const SKIP_FILES = new Set(["scripts/security-scan.mjs"]);
const SKIP_DIRS = new Set(["node_modules", ".next", "out", "public/doc"]);
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);

const RULES = [
  { id: "eval", pattern: /\beval\s*\(/, severity: "high" },
  { id: "function-constructor", pattern: /new\s+Function\s*\(/, severity: "high" },
  { id: "child-process-exec", pattern: /exec(?:Sync)?\s*\(/, severity: "medium" },
  { id: "reverse-shell", pattern: /\/bin\/(?:ba)?sh|nc\s+-e|mkfifo/, severity: "high" },
  { id: "crypto-miner", pattern: /xmrig|coinhive|stratum\+tcp/i, severity: "high" },
  {
    id: "unknown-webhook",
    pattern: /discord\.com\/api\/webhooks|hooks\.slack\.com|pastebin\.com/i,
    severity: "high",
  },
  {
    id: "obfuscated-fetch",
    pattern: /fetch\s*\(\s*atob\s*\(/,
    severity: "high",
  },
];

const ALLOWLIST = new Map([
  ["scripts/build-docs.mjs", new Set(["child-process-exec"])],
]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
      continue;
    }
    if (EXTENSIONS.has(extname(entry))) files.push(full);
  }
  return files;
}

let findings = 0;

for (const scanDir of SCAN_DIRS) {
  const base = join(root, scanDir);
  if (!existsSync(base)) continue;
  for (const file of walk(base)) {
    const rel = file.slice(root.length + 1);
    if (SKIP_FILES.has(rel)) continue;
    const content = readFileSync(file, "utf8");
    const allow = ALLOWLIST.get(rel) ?? new Set();

    for (const rule of RULES) {
      if (allow.has(rule.id)) continue;
      if (rule.pattern.test(content)) {
        console.error(`[${rule.severity}] ${rule.id} in ${rel}`);
        findings += 1;
      }
    }
  }
}

if (findings > 0) {
  console.error(`\nSecurity scan failed: ${findings} suspicious pattern(s).`);
  process.exit(1);
}

console.log("Security scan passed: no malware/backdoor patterns detected.");