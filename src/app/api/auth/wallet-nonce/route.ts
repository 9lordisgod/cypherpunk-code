import { NextResponse } from "next/server";
import { createWalletNonce } from "@/lib/wallet/nonce";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const chain = body.chain?.toString();

  if (chain !== "solana" && chain !== "bitcoin") {
    return NextResponse.json({ error: "Invalid chain" }, { status: 400 });
  }

  const host = request.headers.get("host") ?? "localhost";
  const domain = host.split(":")[0];

  const payload = await createWalletNonce(chain, domain);
  return NextResponse.json(payload);
}