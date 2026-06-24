/**
 * Pure-node exercise of shipped Solana wallet modules (no Vitest, no @/ aliases).
 */
import assert from "node:assert/strict";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getSolanaProviderSpec,
  getSolanaWalletConfig,
} from "../src/lib/wallet/solana-config";
import { verifyWalletProof } from "../src/lib/wallet/verify-proof";
import { verifySolanaLegacySignature } from "../src/lib/wallet/verify-solana";

const config = getSolanaWalletConfig();
assert.equal(config.network, WalletAdapterNetwork.Mainnet);
assert.equal(config.autoConnect, false);
assert.ok(config.endpoint.includes("mainnet"));
assert.deepEqual(config.adapterNames, ["Phantom", "Solflare"]);
console.log("getSolanaWalletConfig:", config);

const spec = getSolanaProviderSpec();
assert.deepEqual(spec.providers, [
  "ConnectionProvider",
  "WalletProvider",
  "WalletModalProvider",
]);
assert.ok(spec.stylesheets[0].includes("wallet-adapter-react-ui"));
assert.equal(spec.config.endpoint, config.endpoint);
console.log("getSolanaProviderSpec:", spec);

const invalidProof = verifyWalletProof({
  mode: "legacy",
  chain: "solana",
  nonce: "nonce123",
  address: "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM",
  signature: "invalid",
  signedMessage: Buffer.from("nonce123").toString("base64"),
});
assert.equal(invalidProof, null);
console.log("verifyWalletProof invalid:", invalidProof);

const legacyInvalid = verifySolanaLegacySignature(
  "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM",
  Buffer.from("test").toString("base64"),
  "invalid",
  "nonce123"
);
assert.equal(legacyInvalid, false);
console.log("verifySolanaLegacySignature invalid:", legacyInvalid);

console.log("direct-exercise-solana: all assertions passed");