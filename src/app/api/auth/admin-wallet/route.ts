/**
 * Admin wallet proof — Solana signature + whitelist → one-time admin login ticket.
 */
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { handleApiRoute } from "@/lib/api-handler";
import { guardApiRequest } from "@/lib/security/guard";
import { prisma } from "@/lib/db";
import { isAdminSolanaAddress } from "@/lib/wallet/admin-whitelist";
import { hashWalletIdentity } from "@/lib/wallet/identity";
import { consumeWalletNonce } from "@/lib/wallet/nonce";
import { verifyWalletProof } from "@/lib/wallet/verify-proof";

const LOGIN_TICKET_TTL_MS = 60 * 1000;

export async function POST(request: Request) {
  return handleApiRoute(async () => {
    const blocked = guardApiRequest(request, "api:admin-wallet");
    if (blocked) return blocked;

    const body = await request.json().catch(() => ({}));
    const verified = verifyWalletProof(body);

    if (!verified || verified.chain !== "solana") {
      return NextResponse.json({ error: "Invalid wallet proof" }, { status: 400 });
    }

    const nonce = body.nonce?.toString();
    if (!nonce) {
      return NextResponse.json({ error: "Missing nonce" }, { status: 400 });
    }

    const nonceValid = await consumeWalletNonce("solana", nonce);
    if (!nonceValid) {
      return NextResponse.json({ error: "Expired or invalid nonce" }, { status: 401 });
    }

    if (!isAdminSolanaAddress(verified.address)) {
      return NextResponse.json({ error: "Wallet not authorized" }, { status: 403 });
    }

    const walletKeyHash = hashWalletIdentity("solana", verified.address);

    let user = await prisma.user.findUnique({ where: { walletKeyHash } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletKeyHash,
          name: "Admin",
          role: "admin",
        },
      });
    } else if (user.role !== "admin") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: "Admin", role: "admin" },
      });
    }

    const loginTicket = randomUUID();
    const expires = new Date(Date.now() + LOGIN_TICKET_TTL_MS);

    await prisma.verificationToken.create({
      data: {
        identifier: `admin-wallet-login:${loginTicket}`,
        token: user.id,
        expires,
      },
    });

    return NextResponse.json({ loginTicket });
  });
}