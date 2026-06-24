/**
 * Wallet proof endpoint — verifies signed nonce, issues one-time login ticket.
 * Privacy: only walletKeyHash (SHA-256) is stored; raw addresses are discarded after verify.
 */
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { handleApiRoute } from "@/lib/api-handler";
import { guardApiRequest } from "@/lib/security/guard";
import { prisma } from "@/lib/db";
import { learnerDisplayName, hashWalletIdentity } from "@/lib/wallet/identity";
import { consumeWalletNonce } from "@/lib/wallet/nonce";
import { verifyWalletProof } from "@/lib/wallet/verify-proof";

const LOGIN_TICKET_TTL_MS = 60 * 1000;

export async function POST(request: Request) {
  return handleApiRoute(async () => {
    const blocked = guardApiRequest(request, "api:wallet");
    if (blocked) return blocked;

    const body = await request.json().catch(() => ({}));
    const verified = verifyWalletProof(body);

    if (!verified) {
      return NextResponse.json({ error: "Invalid wallet proof" }, { status: 400 });
    }

    const nonce = body.nonce?.toString();
    if (!nonce) {
      return NextResponse.json({ error: "Missing nonce" }, { status: 400 });
    }

    const nonceValid = await consumeWalletNonce(nonce);
    if (!nonceValid) {
      return NextResponse.json({ error: "Expired or invalid nonce" }, { status: 401 });
    }

    const walletKeyHash = hashWalletIdentity(verified.chain, verified.address);

    let user = await prisma.user.findUnique({ where: { walletKeyHash } });
    if (!user) {
      const created = await prisma.user.create({
        data: {
          walletKeyHash,
          name: "Learner",
          role: "learner",
        },
      });
      user = await prisma.user.update({
        where: { id: created.id },
        data: { name: learnerDisplayName(created.id) },
      });
    }

    const loginTicket = randomUUID();
    const expires = new Date(Date.now() + LOGIN_TICKET_TTL_MS);

    await prisma.verificationToken.create({
      data: {
        identifier: `wallet-login:${loginTicket}`,
        token: user.id,
        expires,
      },
    });

    return NextResponse.json({ loginTicket });
  });
}