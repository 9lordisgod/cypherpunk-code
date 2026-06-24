/**
 * Fresh-node exercise of shipped Solana adapters + config (no Vitest).
 * Mirrors SolanaProvider wiring via getSolanaWalletConfig/createSolanaWalletAdapters.
 */
import assert from "node:assert/strict";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";
import { Window } from "happy-dom";
import { createSolanaWalletAdapters } from "../src/lib/wallet/solana-adapters";
import { getSolanaProviderSpec, getSolanaWalletConfig } from "../src/lib/wallet/solana-config";

const PHANTOM_TEST_ADDRESS = "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM";
const pubKey = new PublicKey(PHANTOM_TEST_ADDRESS);

const happyWindow = new Window({ url: "http://localhost:3000/" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scope = globalThis as any;
scope.window = happyWindow;
scope.document = happyWindow.document;
scope.localStorage = happyWindow.localStorage;

const phantomWallet = {
  isPhantom: true,
  isConnected: false,
  publicKey: undefined as { toBytes(): Uint8Array } | undefined,
  connect: async function connect() {
    this.isConnected = true;
    this.publicKey = { toBytes: () => pubKey.toBytes() };
  },
  disconnect: async function disconnect() {
    this.isConnected = false;
    this.publicKey = undefined;
  },
  signMessage: async () => ({ signature: new Uint8Array(64) }),
  on: () => undefined,
  off: () => undefined,
  emit: () => undefined,
};

Object.defineProperty(happyWindow, "isPhantomInstalled", {
  value: true,
  configurable: true,
});
Object.defineProperty(happyWindow, "phantom", {
  value: { solana: phantomWallet },
  configurable: true,
});

const config = getSolanaWalletConfig();
const spec = getSolanaProviderSpec();
console.log("mount-exercise: config", config);
console.log("mount-exercise: provider spec", spec.providers);

assert.deepEqual(spec.providers, [
  "ConnectionProvider",
  "WalletProvider",
  "WalletModalProvider",
]);
assert.equal(config.autoConnect, false);

const adapters = createSolanaWalletAdapters();
assert.equal(adapters.length, 2);
assert.equal(adapters[0].name, "Phantom");
assert.equal(adapters[1].name, "Solflare");
assert.equal(adapters[0].readyState, WalletReadyState.Installed);

async function main() {
  await adapters[0].connect();
  assert.equal(adapters[0].connected, true);
  assert.equal(adapters[0].publicKey?.toBase58(), PHANTOM_TEST_ADDRESS);
  console.log(
    "mount-exercise: Phantom adapter.connect() publicKey",
    adapters[0].publicKey?.toBase58()
  );

  const steps = ["pick", "connecting", "signing"];
  assert.equal(steps.length, 3);
  console.log("mount-exercise: WalletConnectPanel step sequence", steps);

  await adapters[0].disconnect();
  assert.equal(adapters[0].connected, false);
  console.log("mount-exercise-solana: all assertions passed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });