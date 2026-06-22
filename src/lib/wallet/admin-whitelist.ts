const DEFAULT_ADMIN_SOLANA_WALLETS = [
  "6fjNtoBhMkghY6CDfUof4dPvYiYrv68SRyHQimdCqm8w",
] as const;

/** Comma-separated Solana addresses allowed to sign in as admin. */
export function getAdminSolanaAddresses(): string[] {
  const fromEnv = process.env.ADMIN_SOLANA_WALLETS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (fromEnv?.length) return fromEnv;
  return [...DEFAULT_ADMIN_SOLANA_WALLETS];
}

export function isAdminSolanaAddress(address: string): boolean {
  const normalized = address.trim();
  return getAdminSolanaAddresses().includes(normalized);
}