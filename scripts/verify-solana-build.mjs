/**
 * Verification plan step 5: inspect build artifacts and live page smoke.
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const nextDir = join(root, ".next");
const outWalletDir = join(root, "out", "branding", "wallets");

const FILENAME_MARKERS = [
  "wallet-adapter",
  "solflare-wallet",
  "phantom-wallet",
  "wallet-standard",
];

const CONTENT_MARKERS = [
  "@solana/wallet-adapter",
  "wallet-adapter-button",
  "wallet-adapter-react",
  "ConnectionProvider",
];

function sampleFileContent(filePath, maxBytes = 200_000) {
  try {
    const size = statSync(filePath).size;
    const buf = readFileSync(filePath);
    return buf.subarray(0, Math.min(size, maxBytes)).toString("utf8");
  } catch {
    return "";
  }
}

function findWalletAdapterChunks(dir, hits = []) {
  if (!existsSync(dir)) return hits;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      findWalletAdapterChunks(full, hits);
      continue;
    }
    if (!/\.(js|css|map)$/.test(entry.name)) continue;

    const nameHit = FILENAME_MARKERS.some((marker) => entry.name.includes(marker));
    const content = sampleFileContent(full);
    const contentHit = CONTENT_MARKERS.some((marker) => content.includes(marker));

    if (nameHit || contentHit) {
      hits.push({
        path: full.replace(root, ""),
        nameHit,
        contentHit,
      });
    }
  }
  return hits;
}

const chunks = [
  ...findWalletAdapterChunks(join(nextDir, "static")),
  ...findWalletAdapterChunks(join(nextDir, "server")),
];

if (chunks.length === 0) {
  console.error("verify-solana-build: no wallet-adapter chunks in .next");
  process.exit(1);
}

const markerHits = {
  "wallet-adapter-filename": chunks.filter((c) => c.nameHit && c.path.includes("wallet-adapter"))
    .length,
  "wallet-adapter-content": chunks.filter((c) =>
    sampleFileContent(join(root, c.path)).includes("@solana/wallet-adapter")
  ).length,
  "wallet-adapter-css": chunks.filter((c) => c.path.endsWith(".css")).length,
  "solflare-wallet": chunks.filter((c) => c.path.includes("solflare-wallet")).length,
  total: chunks.length,
};

console.log("verify-solana-build: wallet-adapter chunks found:", chunks.length);
console.log("verify-solana-build: marker hits:", markerHits);
chunks.slice(0, 12).forEach((chunk) => console.log("  ", chunk.path));

if (markerHits["wallet-adapter-content"] === 0 && markerHits["wallet-adapter-css"] === 0) {
  console.error("verify-solana-build: missing wallet-adapter content in build artifacts");
  process.exit(1);
}

if (existsSync(outWalletDir)) {
  const wallets = readdirSync(outWalletDir);
  const stale = wallets.filter((f) => f === "unisat.svg" || f === "xverse.svg");
  if (stale.length > 0) {
    console.error(`verify-solana-build: stale /out wallet assets: ${stale.join(", ")}`);
    process.exit(1);
  }
  console.log("verify-solana-build: /out/branding/wallets clean:", wallets.join(", "));
} else {
  console.log("verify-solana-build: no /out tree (using .next as equivalent)");
}

const port = 3456;
const server = spawn("npm", ["run", "start", "--", "-p", String(port)], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: String(port) },
});

let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));

async function waitForServer(ms = 20000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.ok) return await res.text();
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("server did not become ready");
}

async function fetchSmoke() {
  const html = await waitForServer();
  const checks = [
    ["auth-slot", html.includes("auth-slot")],
    ["Sign in", html.includes("Sign in")],
  ];
  for (const [label, ok] of checks) {
    if (!ok) {
      console.error(`verify-solana-build: missing '${label}' in homepage HTML`);
      process.exit(1);
    }
    console.log(`verify-solana-build: homepage contains '${label}'`);
  }
}

async function playwrightSmoke() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.log("verify-solana-build: playwright not installed, fetch smoke only");
    return fetchSmoke();
  }

  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const pageErrors = [];

  try {
    const page = await browser.newPage();
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      if (text.includes("Failed to load resource")) return;
      consoleErrors.push(text);
    });
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    await page.waitForSelector('[class*="auth-slot"], a:has-text("Sign in")', {
      timeout: 10000,
    });

    const signInVisible = await page.locator('text=Sign in').first().isVisible();
    if (!signInVisible) {
      console.error("verify-solana-build: Sign in not visible in browser");
      process.exit(1);
    }
    console.log("verify-solana-build: browser smoke — Sign in visible");

    if (consoleErrors.length > 0) {
      console.error("verify-solana-build: browser console errors:", consoleErrors);
      process.exit(1);
    }
    if (pageErrors.length > 0) {
      console.error("verify-solana-build: page errors:", pageErrors);
      process.exit(1);
    }
    console.log("verify-solana-build: browser smoke — zero console/page errors");
  } finally {
    await browser.close();
  }
}

try {
  const panelSource = readFileSync(
    join(root, "src/components/auth/WalletConnectPanel.tsx"),
    "utf8"
  );
  if (!panelSource.includes("wallet-connect-steps")) {
    console.error("verify-solana-build: WalletConnectPanel missing step tracker markup");
    process.exit(1);
  }
  console.log("verify-solana-build: WalletConnectPanel ships wallet-connect-steps UI");

  await playwrightSmoke();
} catch (error) {
  console.error("verify-solana-build: page smoke failed:", error);
  console.error(serverLog.slice(-2000));
  process.exit(1);
} finally {
  server.kill("SIGTERM");
}

console.log("verify-solana-build: all checks passed");