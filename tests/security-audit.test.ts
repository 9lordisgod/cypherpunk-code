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
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PASSWORD_HASH;
    delete process.env.AUTH_SECRET;
    delete process.env.DEV_LOGIN_ENABLED;
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

  it("requires admin credentials in production", () => {
    process.env.NODE_ENV = "production";
    process.env.AUTH_SECRET = "test-secret";

    const issues = collectProductionSecurityIssues();
    expect(issues.some((i) => i.code === "ADMIN_EMAIL_UNSET")).toBe(true);
    expect(issues.some((i) => i.code === "ADMIN_PASSWORD_UNSET")).toBe(true);
  });

  it("flags dev login enabled in production config check", () => {
    process.env.NODE_ENV = "production";
    process.env.ADMIN_EMAIL = "admin@example.com";
    process.env.ADMIN_PASSWORD = "secret";
    process.env.AUTH_SECRET = "test-secret";
    process.env.DEV_LOGIN_ENABLED = "true";

    const issues = collectProductionSecurityIssues();
    expect(issues.some((i) => i.code === "DEV_LOGIN_ENABLED")).toBe(true);
  });
});