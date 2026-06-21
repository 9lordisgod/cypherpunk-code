import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const MAX_FEEDBACK_LENGTH = 4000;

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json().catch(() => ({}));

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
      userId: session?.user?.id ?? null,
      name,
      email,
      xHandle,
      message,
    },
  });

  return NextResponse.json({ feedback: { id: feedback.id } });
}