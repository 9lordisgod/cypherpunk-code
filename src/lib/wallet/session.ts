"use client";

import { signIn } from "next-auth/react";
import type { SolanaSignInInput } from "@solana/wallet-standard-features";
import {
  authenticateBitcoinWallet,
  type BitcoinWalletId,
} from "./bitcoin-connect";
import type { BitcoinNoncePayload, SolanaNoncePayload } from "./nonce-client";
import {
  authenticateSolanaWallet,
  type SolanaWalletId,
} from "./solana-connect";

type SolanaProof =
  | {
      mode: "siws";
      chain: "solana";
      nonce: string;
      address: string;
      signInInput: SolanaSignInInput;
      signInOutput: unknown;
    }
  | {
      mode: "legacy";
      chain: "solana";
      nonce: string;
      address: string;
      signature: string;
      signedMessage: string;
    };

type BitcoinProof = {
  mode: "bitcoin";
  chain: "bitcoin";
  nonce: string;
  address: string;
  signature: string;
};

async function verifyWallet(proof: SolanaProof | BitcoinProof) {
  const response = await fetch("/api/auth/wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proof),
  });

  if (!response.ok) throw new Error("WALLET_VERIFY_FAILED");
  return response.json() as Promise<{ loginTicket: string }>;
}

async function completeSession(loginTicket: string) {
  const result = await signIn("wallet", {
    loginTicket,
    redirect: false,
    callbackUrl: "/account",
  });

  if (result?.error) throw new Error("SESSION_FAILED");
}

export async function loginWithSolanaWallet(
  walletId: SolanaWalletId,
  payload: SolanaNoncePayload
) {
  const proof = await authenticateSolanaWallet(walletId, payload);

  const body: SolanaProof =
    proof.mode === "siws"
      ? {
          mode: "siws",
          chain: "solana",
          nonce: payload.nonce,
          address: proof.address,
          signInInput: proof.signInInput,
          signInOutput: proof.signInOutput,
        }
      : {
          mode: "legacy",
          chain: "solana",
          nonce: payload.nonce,
          address: proof.address,
          signature: proof.signature,
          signedMessage: proof.signedMessage,
        };

  const { loginTicket } = await verifyWallet(body);
  await completeSession(loginTicket);
}

export async function loginWithBitcoinWallet(
  walletId: BitcoinWalletId,
  payload: BitcoinNoncePayload
) {
  const proof = await authenticateBitcoinWallet(walletId, payload);

  const { loginTicket } = await verifyWallet({
    mode: "bitcoin",
    chain: "bitcoin",
    nonce: payload.nonce,
    address: proof.address,
    signature: proof.signature,
  });

  await completeSession(loginTicket);
}