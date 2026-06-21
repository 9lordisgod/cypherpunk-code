"use client";

import {
  AddressPurpose,
  BitcoinNetworkType,
  DefaultAdaptersInfo,
  request,
  RpcErrorCode,
  setDefaultProvider,
} from "sats-connect";
import { walletBrandAssets } from "./brand-assets";
import type { BitcoinNoncePayload } from "./nonce-client";

export type BitcoinWalletId = "xverse" | "unisat";

export type BitcoinWalletOption = {
  id: BitcoinWalletId;
  name: string;
  icon: string;
  installed: boolean;
  installUrl: string;
};

const BITCOIN_WALLETS: Array<{
  id: BitcoinWalletId;
  name: string;
  icon: string;
  providerId: string;
  installUrl: string;
  detect: () => boolean;
}> = [
  {
    id: "xverse",
    name: "Xverse",
    icon: walletBrandAssets.xverse,
    providerId: DefaultAdaptersInfo.xverse.id,
    installUrl: DefaultAdaptersInfo.xverse.chromeWebStoreUrl ?? "https://www.xverse.app/",
    detect: () =>
      Boolean(
        window.XverseProviders?.BitcoinProvider ||
          window.BitcoinProvider ||
          window.btc_providers?.length
      ),
  },
  {
    id: "unisat",
    name: "Unisat",
    icon: walletBrandAssets.unisat,
    providerId: DefaultAdaptersInfo.unisat.id,
    installUrl: DefaultAdaptersInfo.unisat.webUrl ?? "https://unisat.io/",
    detect: () => Boolean(window.unisat),
  },
];

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

export function listBitcoinWallets(): BitcoinWalletOption[] {
  return BITCOIN_WALLETS.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    icon: wallet.icon,
    installed: wallet.detect(),
    installUrl: wallet.installUrl,
  }));
}

async function authenticateUnisat(legacyMessage: string) {
  if (!window.unisat) throw new Error("WALLET_NOT_INSTALLED");

  try {
    const accounts = await window.unisat.requestAccounts();
    const address = accounts[0];
    if (!address) throw new Error("BITCOIN_NO_ADDRESS");

    const signature = await window.unisat.signMessage(legacyMessage);
    return { address, signature };
  } catch (error) {
    rejectIfUserCancelled(error);
    throw error;
  }
}

async function authenticateXverse(payload: BitcoinNoncePayload) {
  setDefaultProvider(DefaultAdaptersInfo.xverse.id);

  const connectResponse = await request("wallet_connect", {
    addresses: [AddressPurpose.Payment],
    network: BitcoinNetworkType.Mainnet,
    message: payload.connectMessage.slice(0, 80),
  });

  if (connectResponse.status !== "success") {
    if (connectResponse.error?.code === RpcErrorCode.USER_REJECTION) {
      throw new Error("USER_REJECTED");
    }
    throw new Error("BITCOIN_CONNECT_FAILED");
  }

  const paymentAddress = connectResponse.result.addresses.find(
    (entry) => entry.purpose === AddressPurpose.Payment
  )?.address;

  if (!paymentAddress) throw new Error("BITCOIN_NO_ADDRESS");

  const signResponse = await request("signMessage", {
    address: paymentAddress,
    message: payload.legacyMessage,
  });

  if (signResponse.status !== "success") {
    if (signResponse.error?.code === RpcErrorCode.USER_REJECTION) {
      throw new Error("USER_REJECTED");
    }
    throw new Error("BITCOIN_SIGN_FAILED");
  }

  return {
    address: paymentAddress,
    signature: signResponse.result.signature,
  };
}

export async function authenticateBitcoinWallet(
  walletId: BitcoinWalletId,
  payload: BitcoinNoncePayload
) {
  const signed =
    walletId === "unisat"
      ? await authenticateUnisat(payload.legacyMessage)
      : await authenticateXverse(payload);

  return {
    mode: "bitcoin" as const,
    address: signed.address,
    signature: signed.signature,
  };
}