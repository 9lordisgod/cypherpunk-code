import { createHash } from "node:crypto";

export type WalletChain = "solana";

/** One-way key — raw wallet addresses are never stored. */
export function hashWalletIdentity(chain: WalletChain, address: string) {
  return createHash("sha256")
    .update(`${chain}:${address.trim()}`)
    .digest("hex");
}

export function learnerDisplayName(userId: string) {
  return `Learner ${userId.slice(-6)}`;
}