import { describe, expect, it } from "vitest";
import { getSolanaWalletConfig } from "@/lib/wallet/solana-config";
import { verifyWalletProof } from "@/lib/wallet/verify-proof";
import { verifySolanaLegacySignature } from "@/lib/wallet/verify-solana";

describe("direct Solana module exercise", () => {
  it("returns mainnet config from shipped provider settings", () => {
    const config = getSolanaWalletConfig();
    expect(config.endpoint).toMatch(/mainnet/i);
    expect(config.autoConnect).toBe(false);
  });

  it("rejects invalid proofs via shipped verifyWalletProof", () => {
    expect(
      verifyWalletProof({
        mode: "legacy",
        chain: "solana",
        nonce: "nonce123",
        address: "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM",
        signature: "invalid",
        signedMessage: Buffer.from("nonce123").toString("base64"),
      })
    ).toBeNull();
  });

  it("rejects invalid legacy signatures via shipped verifier", () => {
    expect(
      verifySolanaLegacySignature(
        "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM",
        Buffer.from("test").toString("base64"),
        "invalid",
        "nonce123"
      )
    ).toBe(false);
  });
});