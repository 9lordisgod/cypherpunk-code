"use client";

import type { WalletAdapter } from "@solana/wallet-adapter-base";
import type { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import type { SolanaNoncePayload } from "./nonce-client";

type SignInCapableAdapter = WalletAdapter & {
  signIn?: (input: SolanaSignInInput) => Promise<SolanaSignInOutput>;
};

function bytesToBase64(bytes: Uint8Array) {
  const view = Uint8Array.from(bytes);
  let binary = "";
  for (const byte of view) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function serializeSignInOutput(output: SolanaSignInOutput) {
  return {
    account: {
      address: output.account.address,
      publicKey: bytesToBase64(Uint8Array.from(output.account.publicKey)),
      chains: [...output.account.chains],
      features: [...output.account.features],
    },
    signedMessage: bytesToBase64(Uint8Array.from(output.signedMessage)),
    signature: bytesToBase64(Uint8Array.from(output.signature)),
    signatureType: output.signatureType,
  };
}

function rejectIfUserCancelled(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (
    message.toLowerCase().includes("reject") ||
    message.includes("4001") ||
    message.includes("User rejected")
  ) {
    throw new Error("USER_REJECTED");
  }
}

export async function authenticateSolanaWallet(
  adapter: WalletAdapter,
  payload: SolanaNoncePayload
) {
  if (!adapter.connected) {
    try {
      await adapter.connect();
    } catch (error) {
      rejectIfUserCancelled(error);
      throw error;
    }
  }

  const address = adapter.publicKey?.toBase58();
  if (!address) throw new Error("NO_ACCOUNT");

  const signInInput: SolanaSignInInput = {
    ...payload.signInInput,
    address,
  };

  const signInAdapter = adapter as SignInCapableAdapter;
  if (typeof signInAdapter.signIn === "function") {
    try {
      const output = await signInAdapter.signIn(signInInput);
      return {
        mode: "siws" as const,
        address: output.account.address,
        signInInput,
        signInOutput: serializeSignInOutput(output),
      };
    } catch (error) {
      rejectIfUserCancelled(error);
    }
  }

  if (!("signMessage" in adapter) || typeof adapter.signMessage !== "function") {
    throw new Error("SIGN_MESSAGE_UNSUPPORTED");
  }

  const messageBytes = new TextEncoder().encode(payload.legacyMessage);
  try {
    const signature = await adapter.signMessage(messageBytes);
    return {
      mode: "legacy" as const,
      address,
      signature: bytesToBase64(signature),
      signedMessage: bytesToBase64(messageBytes),
    };
  } catch (error) {
    rejectIfUserCancelled(error);
    throw error;
  }
}