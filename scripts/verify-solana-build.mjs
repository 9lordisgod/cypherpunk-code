/**
 * Verification plan step 5: inspect build artifacts and optional live page smoke.
 */
import { execSync, spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const nextDir = join(root, ".next");
const outWalletDir = join(root, "out", "branding", "wallets");

function findWalletAdapterChunks(dir, hits = []) {
  if (!existsSync(dir)) return hits;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      findWalletAdapterChunks(full, hits);
    } else if (
      entry.name.includes("wallet-adapter") ||
      entry.name.includes("solflare-wallet")
    ) {
      hits.push(full.replace(root, ""));
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

console.log("verify-solana-build: wallet-adapter chunks found:", chunks.length);
chunks.slice(0, 10).forEach((chunk) => console.log("  ", chunk));

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

try {
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

  const panelSource = readFileSync(
    join(root, "src/components/auth/WalletConnectPanel.tsx"),
    "utf8"
  );
  if (!panelSource.includes("wallet-connect-steps")) {
    console.error("verify-solana-build: WalletConnectPanel missing step tracker markup");
    process.exit(1);
  }
  console.log("verify-solana-build: WalletConnectPanel ships wallet-connect-steps UI");
} catch (error) {
  console.error("verify-solana-build: page smoke failed:", error);
  console.error(serverLog.slice(-2000));
  process.exit(1);
} finally {
  server.kill("SIGTERM");
}

console.log("verify-solana-build: all checks passed");