"use client";

import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { getSession, signIn } from "next-auth/react";
import type { SolanaSignInInput } from "@solana/wallet-standard-features";
import type { SolanaNoncePayload } from "./nonce-client";
import { authenticateSolanaWallet } from "./solana-connect";

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

async function verifyWallet(proof: SolanaProof) {
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
  await getSession();
}

export async function loginWithSolanaWallet(
  adapter: WalletAdapter,
  payload: SolanaNoncePayload
) {
  const proof = await authenticateSolanaWallet(adapter, payload);

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