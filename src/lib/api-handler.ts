import { NextResponse } from "next/server";

export async function handleApiRoute(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    console.error("[api]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}