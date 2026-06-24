import { describe, expect, it } from "vitest";
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