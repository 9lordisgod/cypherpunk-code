"use client";

import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { getSession, signIn } from "next-auth/react";
import type { SolanaSignInInput } from "@solana/wallet-standard-features";
import { authenticateSolanaWallet } from "./solana-connect";
import type { SolanaNoncePayload } from "./nonce-client";

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

async function verifyAdminWallet(proof: SolanaProof) {
  const response = await fetch("/api/auth/admin-wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proof),
  });

  if (!response.ok) throw new Error("ADMIN_WALLET_VERIFY_FAILED");
  return response.json() as Promise<{ loginTicket: string }>;
}

async function completeAdminSession(loginTicket: string) {
  const result = await signIn("admin-wallet", {
    loginTicket,
    redirect: false,
    callbackUrl: "/admin",
  });

  if (result?.error) throw new Error("ADMIN_SESSION_FAILED");
  await getSession();
}

export async function loginAdminWithSolanaWallet(
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

  const { loginTicket } = await verifyAdminWallet(body);
  await completeAdminSession(loginTicket);
}