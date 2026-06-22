import type { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { buildLegacySignMessage } from "@/lib/wallet/nonce";
import { verifyBitcoinSignature } from "@/lib/wallet/verify-bitcoin";
import {
  verifySolanaLegacySignature,
  verifySolanaSiws,
} from "@/lib/wallet/verify-solana";

export type WalletProofBody = {
  mode?: string;
  chain?: string;
  nonce?: string;
  address?: string;
  signature?: string;
  signedMessage?: string;
  signInInput?: SolanaSignInInput;
  signInOutput?: unknown;
};

export type VerifiedWalletProof = {
  chain: "solana" | "bitcoin";
  address: string;
};

function deserializeSignInOutput(raw: unknown): SolanaSignInOutput | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const account = value.account as Record<string, unknown> | undefined;
  if (!account || typeof account.address !== "string") return null;

  try {
    return {
      account: {
        address: account.address,
        publicKey: Buffer.from(account.publicKey as string, "base64"),
        chains: (account.chains as SolanaSignInOutput["account"]["chains"]) ?? [],
        features: (account.features as SolanaSignInOutput["account"]["features"]) ?? [],
      },
      signedMessage: Buffer.from(value.signedMessage as string, "base64"),
      signature: Buffer.from(value.signature as string, "base64"),
      signatureType: value.signatureType as SolanaSignInOutput["signatureType"],
    };
  } catch {
    return null;
  }
}

export function verifyWalletProof(body: WalletProofBody): VerifiedWalletProof | null {
  const mode = body.mode?.toString();
  const chain = body.chain?.toString();
  const nonce = body.nonce?.toString();
  const address = body.address?.toString().trim();

  if (!mode || !chain || !nonce || !address) return null;
  if (chain !== "solana" && chain !== "bitcoin") return null;

  let signatureValid = false;
  let verifiedAddress = address;

  if (mode === "siws" && chain === "solana") {
    const signInInput = body.signInInput;
    const signInOutput = deserializeSignInOutput(body.signInOutput);
    if (!signInInput || !signInOutput) return null;
    if (signInInput.nonce !== nonce) return null;
    signatureValid = verifySolanaSiws(signInInput, signInOutput);
    if (signatureValid) verifiedAddress = signInOutput.account.address;
  } else if (mode === "legacy" && chain === "solana") {
    const signature = body.signature?.toString();
    const signedMessage = body.signedMessage?.toString();
    if (!signature || !signedMessage) return null;
    signatureValid = verifySolanaLegacySignature(address, signedMessage, signature, nonce);
  } else if (mode === "bitcoin" && chain === "bitcoin") {
    const signature = body.signature?.toString();
    if (!signature) return null;
    const message = buildLegacySignMessage("bitcoin", nonce);
    signatureValid = verifyBitcoinSignature(address, message, signature);
  } else {
    return null;
  }

  if (!signatureValid) return null;
  return { chain, address: verifiedAddress };
}