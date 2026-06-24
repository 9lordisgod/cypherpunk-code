/**
 * Orchestrates the full Solana quick-start audit per goal verification plan.
 * Tees all output into {SCRATCH}/solana-audit-bundle.log and per-step logs.
 */
import { execSync, spawnSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const scratch =
  process.env.SCRATCH ||
  process.env.GROK_SCRATCH ||
  join(tmpdir(), "solana-audit");
mkdirSync(scratch, { recursive: true });

const bundlePath = join(scratch, "solana-audit-bundle.log");
writeFileSync(bundlePath, `solana-audit started ${new Date().toISOString()}\n`);

function log(line) {
  const text = `${line}\n`;
  process.stdout.write(text);
  appendFileSync(bundlePath, text);
}

function readScratch(file) {
  const path = join(scratch, file);
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function runStep(name, command, args, logFile) {
  log(`\n=== ${name} ===`);
  log(`$ ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    env: process.env,
    shell: false,
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  writeFileSync(join(scratch, logFile), output);
  appendFileSync(bundlePath, output);
  if (!output.endsWith("\n")) appendFileSync(bundlePath, "\n");
  log(`${name}: exit ${result.status ?? 1}`);
  if (result.status !== 0) {
    log(`solana-audit FAILED at step: ${name}`);
    process.exit(result.status ?? 1);
  }
  return output;
}

if (!existsSync(join(root, "node_modules"))) {
  runStep("npm ci", "npm", ["ci"], "npm-ci.log");
}

runStep("build 1", "npm", ["run", "build"], "build-1.log");
runStep("build 2", "npm", ["run", "build"], "build-2.log");

for (const logName of ["build-1.log", "build-2.log"]) {
  const buildLog = readScratch(logName);
  if (/middleware.*deprecated|middleware-to-proxy/i.test(buildLog)) {
    log(`WARNING: ${logName} still mentions deprecated middleware convention`);
    process.exit(1);
  }
  if (/wallet-adapter.*error|turbopack.*crash/i.test(buildLog)) {
    log(`ERROR: ${logName} contains Solana/Turbopack failure`);
    process.exit(1);
  }
}

runStep("lint", "npm", ["run", "lint"], "lint.log");
runStep("test 1", "npm", ["test"], "test.log");
runStep("test 2", "npm", ["test"], "test-2.log");

const testOutput = readScratch("test.log") + readScratch("test-2.log");
if (!/solana-provider-mount\.test\.tsx/.test(testOutput)) {
  log("ERROR: mount test not found in test output");
  process.exit(1);
}
if (!/wallet-verify\.test\.ts|solana-direct-exercise\.test\.ts/.test(testOutput)) {
  log("ERROR: wallet verify tests not exercised");
  process.exit(1);
}

runStep("exercise:solana", "npm", ["run", "exercise:solana"], "direct-exercise.log");
runStep("verify:solana", "npm", ["run", "verify:solana"], "verify-build.log");

const head = execSync("git rev-parse HEAD", { cwd: root, encoding: "utf8" }).trim();
const stamp = {
  auditedAt: new Date().toISOString(),
  gitHead: head,
  scratch,
  bundleLog: bundlePath,
  paths: [
    "src/components/auth/SolanaProvider.tsx",
    "src/components/auth/WalletConnectPanel.tsx",
    "src/lib/wallet/solana-config.ts",
    "src/lib/wallet/solana-adapters.ts",
    "src/proxy.ts",
    "scripts/run-solana-audit.mjs",
    "scripts/verify-solana-build.mjs",
    "tests/solana-provider-mount.test.tsx",
    "tests/solana-provider-structure.test.ts",
  ],
  status: "passed",
};

const stampPath = join(root, ".solana-audit-stamp.json");
writeFileSync(stampPath, `${JSON.stringify(stamp, null, 2)}\n`);
log(`\nWrote audit stamp: ${stampPath}`);
log(`Bundle log: ${bundlePath}`);
log("solana-audit: all steps passed");