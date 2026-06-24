import { NextResponse } from "next/server";
import { handleApiRoute } from "@/lib/api-handler";
import { guardApiRequest } from "@/lib/security/guard";
import { normalizeAuthHost } from "@/lib/canonical-site";
import { createWalletNonce } from "@/lib/wallet/nonce";

export async function POST(request: Request) {
  return handleApiRoute(async () => {
    const blocked = guardApiRequest(request, "api:wallet-nonce");
    if (blocked) return blocked;

    const body = await request.json().catch(() => ({}));
    const chain = body.chain?.toString();

    if (chain !== "solana") {
      return NextResponse.json({ error: "Invalid chain" }, { status: 400 });
    }

    const host = request.headers.get("host") ?? "localhost";
    const domain = normalizeAuthHost(host);

    const payload = await createWalletNonce(domain);
    return NextResponse.json(payload);
  });
}