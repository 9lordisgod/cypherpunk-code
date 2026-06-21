import { randomUUID } from "node:crypto";
import type { SolanaSignInInput } from "@solana/wallet-standard-features";
import { prisma } from "@/lib/db";

const NONCE_TTL_MS = 5 * 60 * 1000;

export function buildLegacySignMessage(chain: "solana" | "bitcoin", nonce: string) {
  return `Sign in to Cypherpunk Code\n\nChain: ${chain}\nNonce: ${nonce}`;
}

export function buildSolanaSignInInput(
  nonce: string,
  domain: string
): SolanaSignInInput {
  return {
    domain,
    statement:
      "Sign in to save your course progress. This does not move funds or charge fees.",
    version: "1",
    nonce,
    chainId: "mainnet",
    issuedAt: new Date().toISOString(),
  };
}

export async function createWalletNonce(
  chain: "solana" | "bitcoin",
  domain = "localhost"
) {
  const nonce = randomUUID().replace(/-/g, "").slice(0, 16);
  const expires = new Date(Date.now() + NONCE_TTL_MS);

  // identifier = chain, token = nonce (token is globally unique in this table)
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: chain,
      expires: { lt: new Date() },
    },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: chain,
      token: nonce,
      expires,
    },
  });

  const legacyMessage = buildLegacySignMessage(chain, nonce);

  if (chain === "solana") {
    return {
      nonce,
      legacyMessage,
      signInInput: buildSolanaSignInInput(nonce, domain),
    };
  }

  return {
    nonce,
    legacyMessage,
    connectMessage: "Connect to Cypherpunk Code to save progress.",
  };
}

export async function consumeWalletNonce(chain: "solana" | "bitcoin", nonce: string) {
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: chain,
      token: nonce,
      expires: { gt: new Date() },
    },
  });

  if (!record) return false;

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: record.identifier,
        token: record.token,
      },
    },
  });

  return true;
}