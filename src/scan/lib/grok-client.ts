import {
  checkRateLimit,
  recordRequest,
  getStoredApiKey,
} from "./api-key";

interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGrok(
  messages: GrokMessage[],
  options?: { searchMode?: "auto" | "on" | "off"; maxTokens?: number }
): Promise<{ content: string; citations?: string[] }> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error(
      "No API key configured. Add your xAI key in Settings — you pay xAI directly, not CypherScan."
    );
  }

  const rateCheck = checkRateLimit();
  if (!rateCheck.allowed) {
    const minutes = Math.ceil(rateCheck.resetIn / 60000);
    throw new Error(
      `Rate limit reached (${rateCheck.remaining} remaining). Resets in ~${minutes} min. This protects your API spend.`
    );
  }

  const res = await fetch("/api/grok", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      searchMode: options?.searchMode ?? "auto",
      maxTokens: options?.maxTokens ?? 1500,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? data.message ?? "Grok request failed");
  }

  recordRequest();

  const content = data.choices?.[0]?.message?.content ?? "";
  const citations = data.citations as string[] | undefined;

  return { content, citations };
}