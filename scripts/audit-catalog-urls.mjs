#!/usr/bin/env node
/**
 * Audit catalog resource URLs for HTTPS, blocked domains, and HTTP reachability.
 *
 * Usage: node scripts/audit-catalog-urls.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const resources = JSON.parse(
  readFileSync(join(root, "src/data/resources.json"), "utf8")
);

const BLOCKED = new Set(["cypherpunkschool.com", "www.cypherpunkschool.com"]);

function host(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

async function probe(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "User-Agent": "CypherpunkCode-CatalogAudit/1.0" },
    });
    return res.status;
  } catch {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
        headers: { "User-Agent": "CypherpunkCode-CatalogAudit/1.0" },
      });
      return res.status;
    } catch (error) {
      return `ERR:${error.message}`;
    }
  }
}

let failed = 0;

for (const resource of resources) {
  const hostname = host(resource.url);
  if (!resource.url.startsWith("https://")) {
    console.error(`[blocked] ${resource.id}: non-HTTPS URL`);
    failed += 1;
    continue;
  }
  if (!hostname || BLOCKED.has(hostname)) {
    console.error(`[blocked] ${resource.id}: ${resource.url}`);
    failed += 1;
    continue;
  }

  const status = await probe(resource.url);
  if (typeof status === "number" && status >= 400) {
    console.warn(`[warn] ${resource.id}: HTTP ${status} — ${resource.url}`);
  } else if (typeof status === "string" && status.startsWith("ERR:")) {
    console.warn(`[warn] ${resource.id}: ${status} — ${resource.url}`);
  } else {
    console.log(`[ok] ${resource.id}: ${status}`);
  }
}

if (failed > 0) {
  console.error(`\nAudit failed: ${failed} catalog URL(s) blocked or invalid.`);
  process.exit(1);
}

console.log(`\nAudit passed: ${resources.length} catalog URLs checked.`);