import { describe, expect, it } from "vitest";
import { buildSolanaSignInInput } from "@/lib/wallet/nonce";
import { verifyWalletProof } from "@/lib/wallet/verify-proof";
import { verifySolanaLegacySignature } from "@/lib/wallet/verify-solana";

describe("verifySolanaLegacySignature", () => {
  it("rejects invalid signatures", () => {
    expect(
      verifySolanaLegacySignature(
        "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM",
        Buffer.from("Sign in to Cypherpunk Code").toString("base64"),
        "not-a-valid-signature",
        "abc123"
      )
    ).toBe(false);
  });

  it("rejects messages missing the nonce", () => {
    expect(
      verifySolanaLegacySignature(
        "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM",
        Buffer.from("Sign in to Cypherpunk Code").toString("base64"),
        "abc",
        "missing-nonce"
      )
    ).toBe(false);
  });
});

describe("verifyWalletProof", () => {
  it("rejects legacy proofs with invalid signatures", () => {
    const nonce = "testnonce123456";
    const message = `Sign in to Cypherpunk Code\n\nChain: solana\nNonce: ${nonce}`;

    expect(
      verifyWalletProof({
        mode: "legacy",
        chain: "solana",
        nonce,
        address: "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM",
        signature: "bad-signature",
        signedMessage: Buffer.from(message).toString("base64"),
      })
    ).toBeNull();
  });

  it("rejects bitcoin chain proofs after Solana-only migration", () => {
    expect(
      verifyWalletProof({
        mode: "bitcoin",
        chain: "bitcoin",
        nonce: "abc",
        address: "bc1qtest",
        signature: "sig",
      })
    ).toBeNull();
  });
});

describe("buildSolanaSignInInput", () => {
  it("builds SIWS input with mainnet chainId and domain", () => {
    const input = buildSolanaSignInInput("nonce123", "cypherpunk-code.ca");
    expect(input.domain).toBe("cypherpunk-code.ca");
    expect(input.nonce).toBe("nonce123");
    expect(input.chainId).toBe("mainnet");
    expect(input.statement).toContain("charge fees");
  });
});