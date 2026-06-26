import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { collectProductionSecurityIssues } from "@/lib/security/production-guard";
import { pathnameLooksSuspicious } from "@/lib/security/guard";

const ROOT = join(process.cwd());
const SCAN_DIRS = ["src/app/api", "src/lib", "scripts"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs"]);

const MALWARE_PATTERNS = [
  /\beval\s*\(/,
  /new\s+Function\s*\(/,
  /xmrig|coinhive|stratum\+tcp/i,
  /discord\.com\/api\/webhooks/i,
  /\/bin\/(?:ba)?sh/,
];

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
      continue;
    }
    if (EXTENSIONS.has(extname(entry))) files.push(full);
  }
  return files;
}

describe("security audit", () => {
  afterEach(() => {
    delete process.env.SECURITY_VAULT_KEY;
    delete process.env.SECURITY_VAULT_B64;
    delete process.env.NODE_ENV;
  });

  it("finds no malware patterns in API routes and core libs", () => {
    const hits: string[] = [];
    const skipFiles = new Set(["scripts/security-scan.mjs"]);

    for (const scanDir of SCAN_DIRS) {
      for (const file of walk(join(ROOT, scanDir))) {
        const rel = file.slice(ROOT.length + 1);
        if (skipFiles.has(rel)) continue;
        const content = readFileSync(file, "utf8");
        for (const pattern of MALWARE_PATTERNS) {
          if (pattern.test(content)) hits.push(`${rel}: ${pattern}`);
        }
      }
    }

    expect(hits, hits.join("\n")).toEqual([]);
  });

  it("blocks suspicious probe paths", () => {
    expect(
      pathnameLooksSuspicious(new Request("https://example.com/.env"))
    ).toBe(true);
    expect(
      pathnameLooksSuspicious(new Request("https://example.com/wp-admin"))
    ).toBe(true);
    expect(pathnameLooksSuspicious(new Request("https://example.com/catalog"))).toBe(
      false
    );
  });

  it("warns when security vault is unset in production", () => {
    process.env.NODE_ENV = "production";

    const issues = collectProductionSecurityIssues();
    expect(issues.some((i) => i.code === "SECURITY_VAULT_DEFAULT")).toBe(true);
  });
});