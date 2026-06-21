"use client";

import type { SolanaSignInInput } from "@solana/wallet-standard-features";

export type SolanaNoncePayload = {
  nonce: string;
  legacyMessage: string;
  signInInput: SolanaSignInInput;
};

export type BitcoinNoncePayload = {
  nonce: string;
  legacyMessage: string;
  connectMessage: string;
};

export async function fetchSolanaNonce(): Promise<SolanaNoncePayload> {
  const response = await fetch("/api/auth/wallet-nonce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chain: "solana" }),
  });
  if (!response.ok) throw new Error("NONCE_FAILED");
  return response.json();
}

export async function fetchBitcoinNonce(): Promise<BitcoinNoncePayload> {
  const response = await fetch("/api/auth/wallet-nonce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chain: "bitcoin" }),
  });
  if (!response.ok) throw new Error("NONCE_FAILED");
  return response.json();
}