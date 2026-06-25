import { randomUUID } from "node:crypto";
import type { SolanaSignInInput } from "@solana/wallet-standard-features";
import { prisma } from "@/lib/db";

const NONCE_TTL_MS = 5 * 60 * 1000;

export function buildLegacySignMessage(nonce: string) {
  return `Sign in to Cypherpunk Education\n\nChain: solana\nNonce: ${nonce}`;
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

export async function createWalletNonce(domain = "localhost") {
  const nonce = randomUUID().replace(/-/g, "").slice(0, 16);
  const expires = new Date(Date.now() + NONCE_TTL_MS);

  await prisma.verificationToken.deleteMany({
    where: {
      identifier: "solana",
      expires: { lt: new Date() },
    },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: "solana",
      token: nonce,
      expires,
    },
  });

  return {
    nonce,
    legacyMessage: buildLegacySignMessage(nonce),
    signInInput: buildSolanaSignInInput(nonce, domain),
  };
}

export async function consumeWalletNonce(nonce: string) {
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: "solana",
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