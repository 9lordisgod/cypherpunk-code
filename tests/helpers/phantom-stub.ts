import { WalletReadyState, type WalletAdapter } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";

export const PHANTOM_TEST_ADDRESS = "9xQeWvG816bUx9EPjHmaT23yv3T3BYyMDb8iDLauyfrM";
const pubKey = new PublicKey(PHANTOM_TEST_ADDRESS);

export function installPhantomStub() {
  const phantomWallet = {
    isPhantom: true,
    isConnected: false,
    publicKey: undefined as { toBytes(): Uint8Array } | undefined,
    connect: async function connect() {
      this.isConnected = true;
      this.publicKey = { toBytes: () => pubKey.toBytes() };
    },
    disconnect: async function disconnect() {
      this.isConnected = false;
      this.publicKey = undefined;
    },
    signMessage: async () => ({ signature: new Uint8Array(64) }),
    on: () => undefined,
    off: () => undefined,
    emit: () => undefined,
  };

  Object.defineProperty(window, "isPhantomInstalled", {
    value: true,
    configurable: true,
  });
  Object.defineProperty(window, "phantom", {
    value: { solana: phantomWallet },
    configurable: true,
  });
}

export async function waitForAdapterReady(adapter: WalletAdapter, ms = 3000) {
  if (adapter.readyState === WalletReadyState.Installed) return;

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error(`${adapter.name} not detected`)),
      ms
    );
    adapter.on("readyStateChange", (state) => {
      if (state === WalletReadyState.Installed) {
        window.clearTimeout(timeout);
        resolve();
      }
    });
  });
}