import { NextResponse } from "next/server";
import { handleApiRoute } from "@/lib/api-handler";
import { guardApiRequest, isHoneypotTriggered } from "@/lib/security/guard";
import { prisma } from "@/lib/db";

const MAX_FEEDBACK_LENGTH = 4000;

export async function POST(request: Request) {
  return handleApiRoute(async () => {
    const blocked = guardApiRequest(request, "api:feedback");
    if (blocked) return blocked;

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ feedback: { id: "ok" } });
    }

    const name = body.name?.toString().trim().slice(0, 120);
    const email = body.email?.toString().trim().toLowerCase().slice(0, 254);
    const xHandle = body.xHandle?.toString().trim().slice(0, 64) || null;
    const message = body.message?.toString().trim().slice(0, MAX_FEEDBACK_LENGTH);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: null,
        name,
        email,
        xHandle,
        message,
      },
    });

    return NextResponse.json({ feedback: { id: feedback.id } });
  });
}