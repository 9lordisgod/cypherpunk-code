/**
 * Wallet proof endpoint — verifies signed nonce, issues one-time login ticket.
 * Privacy: only walletKeyHash (SHA-256) is stored; raw addresses are discarded after verify.
 */
import { randomUUID } from "node:crypto";
import type { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { NextResponse } from "next/server";
import { guardApiRequest } from "@/lib/security/guard";
import { prisma } from "@/lib/db";
import { learnerDisplayName, hashWalletIdentity } from "@/lib/wallet/identity";
import { buildLegacySignMessage, consumeWalletNonce } from "@/lib/wallet/nonce";
import { verifyBitcoinSignature } from "@/lib/wallet/verify-bitcoin";
import {
  verifySolanaLegacySignature,
  verifySolanaSiws,
} from "@/lib/wallet/verify-solana";

const LOGIN_TICKET_TTL_MS = 60 * 1000;

function deserializeSignInOutput(raw: unknown): SolanaSignInOutput | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const account = value.account as Record<string, unknown> | undefined;
  if (!account || typeof account.address !== "string") return null;

  try {
    return {
      account: {
        address: account.address,
        publicKey: Buffer.from(account.publicKey as string, "base64"),
        chains: (account.chains as SolanaSignInOutput["account"]["chains"]) ?? [],
        features: (account.features as SolanaSignInOutput["account"]["features"]) ?? [],
      },
      signedMessage: Buffer.from(value.signedMessage as string, "base64"),
      signature: Buffer.from(value.signature as string, "base64"),
      signatureType: value.signatureType as SolanaSignInOutput["signatureType"],
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const blocked = guardApiRequest(request, "api:wallet");
  if (blocked) return blocked;

  const body = await request.json().catch(() => ({}));
  const mode = body.mode?.toString();
  const chain = body.chain?.toString();
  const nonce = body.nonce?.toString();
  const address = body.address?.toString().trim();

  if (!mode || !chain || !nonce || !address) {
    return NextResponse.json({ error: "Missing wallet proof" }, { status: 400 });
  }

  if (chain !== "solana" && chain !== "bitcoin") {
    return NextResponse.json({ error: "Invalid chain" }, { status: 400 });
  }

  const nonceValid = await consumeWalletNonce(chain, nonce);
  if (!nonceValid) {
    return NextResponse.json({ error: "Expired or invalid nonce" }, { status: 401 });
  }

  let signatureValid = false;
  let verifiedAddress = address;

  if (mode === "siws" && chain === "solana") {
    const signInInput = body.signInInput as SolanaSignInInput | undefined;
    const signInOutput = deserializeSignInOutput(body.signInOutput);
    if (!signInInput || !signInOutput) {
      return NextResponse.json({ error: "Invalid SIWS payload" }, { status: 400 });
    }
    if (signInInput.nonce !== nonce) {
      return NextResponse.json({ error: "Nonce mismatch" }, { status: 401 });
    }
    signatureValid = verifySolanaSiws(signInInput, signInOutput);
    if (signatureValid) {
      verifiedAddress = signInOutput.account.address;
    }
  } else if (mode === "legacy" && chain === "solana") {
    const signature = body.signature?.toString();
    const signedMessage = body.signedMessage?.toString();
    if (!signature || !signedMessage) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    signatureValid = verifySolanaLegacySignature(
      address,
      signedMessage,
      signature,
      nonce
    );
  } else if (mode === "bitcoin" && chain === "bitcoin") {
    const signature = body.signature?.toString();
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    const message = buildLegacySignMessage("bitcoin", nonce);
    signatureValid = verifyBitcoinSignature(address, message, signature);
  } else {
    return NextResponse.json({ error: "Invalid proof mode" }, { status: 400 });
  }

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const walletKeyHash = hashWalletIdentity(chain, verifiedAddress);

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
}