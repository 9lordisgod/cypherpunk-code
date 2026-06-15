import { NextRequest, NextResponse } from "next/server";

const XAI_API = "https://api.x.ai/v1/chat/completions";
const DEFAULT_MODEL = "grok-3-mini";

/**
 * BYOK (Bring Your Own Key) proxy — no server-side API key is stored.
 * The user's xAI key is forwarded per-request via Authorization header.
 * All Grok costs are billed to the user's xAI account, not the site operator.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "API key required",
        message:
          "Provide your xAI API key via Authorization header. Get one free at console.x.ai — costs are billed to your account, not CypherScan.",
      },
      { status: 401 }
    );
  }

  let body: {
    messages: { role: string; content: string }[];
    model?: string;
    searchMode?: "auto" | "on" | "off";
    maxTokens?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.messages?.length) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  try {
    const response = await fetch(XAI_API, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.model ?? DEFAULT_MODEL,
        messages: body.messages,
        max_completion_tokens: body.maxTokens ?? 1500,
        temperature: 0.3,
        search_parameters: {
          mode: body.searchMode ?? "auto",
          return_citations: true,
          max_search_results: 5,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error?.message ?? "xAI API error",
          status: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "X-CypherScan-Billing": "user-byok",
        "X-CypherScan-Client": clientIp.slice(0, 20),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Proxy request failed" },
      { status: 502 }
    );
  }
}