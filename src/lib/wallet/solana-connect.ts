"use client";

import type { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import type { SolanaProvider } from "@/types/wallets";
import { walletBrandAssets } from "./brand-assets";
import type { SolanaNoncePayload } from "./nonce-client";

export type SolanaWalletId = "phantom" | "solflare" | "backpack";

export type SolanaWalletOption = {
  id: SolanaWalletId;
  name: string;
  icon: string;
  installed: boolean;
  installUrl: string;
};

const SOLANA_WALLETS: Array<{
  id: SolanaWalletId;
  name: string;
  icon: string;
  installUrl: string;
  detect: () => SolanaProvider | null;
}> = [
  {
    id: "phantom",
    name: "Phantom",
    icon: walletBrandAssets.phantom,
    installUrl: "https://phantom.app/download",
    detect: () => window.phantom?.solana ?? (window.solana?.isPhantom ? window.solana : null) ?? null,
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: walletBrandAssets.solflare,
    installUrl: "https://solflare.com/download",
    detect: () => window.solflare?.isSolflare ? window.solflare : null,
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: walletBrandAssets.backpack,
    installUrl: "https://backpack.app/download",
    detect: () => window.backpack?.isBackpack ? window.backpack : null,
  },
];

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

export function listSolanaWallets(): SolanaWalletOption[] {
  return SOLANA_WALLETS.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    icon: wallet.icon,
    installed: Boolean(wallet.detect()),
    installUrl: wallet.installUrl,
  }));
}

function getProvider(id: SolanaWalletId): SolanaProvider {
  const entry = SOLANA_WALLETS.find((wallet) => wallet.id === id);
  const provider = entry?.detect();
  if (!provider) throw new Error("WALLET_NOT_INSTALLED");
  return provider;
}

export async function authenticateSolanaWallet(
  walletId: SolanaWalletId,
  payload: SolanaNoncePayload
) {
  const provider = getProvider(walletId);

  // Connect first so the extension popup opens reliably, then sign.
  try {
    await provider.connect({ onlyIfTrusted: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("reject") || message.includes("4001")) {
      throw new Error("USER_REJECTED");
    }
    throw error;
  }

  const address = provider.publicKey?.toBase58();
  if (!address) throw new Error("NO_ACCOUNT");

  const signInInput: SolanaSignInInput = {
    ...payload.signInInput,
    address,
  };

  if (typeof provider.signIn === "function") {
    try {
      const output = await provider.signIn(signInInput);
      return {
        mode: "siws" as const,
        address: output.account.address,
        signInInput,
        signInOutput: serializeSignInOutput(output),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.toLowerCase().includes("reject") || message.includes("4001")) {
        throw new Error("USER_REJECTED");
      }
    }
  }

  const messageBytes = new TextEncoder().encode(payload.legacyMessage);
  let signed: { signature: Uint8Array; signedMessage?: Uint8Array };
  try {
    signed = await provider.signMessage(messageBytes, "utf8");
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("reject") || message.includes("4001")) {
      throw new Error("USER_REJECTED");
    }
    signed = await provider.signMessage(messageBytes);
  }

  return {
    mode: "legacy" as const,
    address,
    signature: bytesToBase64(signed.signature),
    signedMessage: bytesToBase64(signed.signedMessage ?? messageBytes),
  };
}