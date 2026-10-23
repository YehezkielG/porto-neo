import { NextResponse } from "next/server";

const DEFAULT_CHATBOT_URL =
  "https://yehezkiel-haganta.vercel.app/api/ask-kiel";
const MAX_MESSAGE_LENGTH = 300;
const MAX_HISTORY_ITEMS = 12;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  const body = payload as { message?: unknown; history?: unknown };
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must contain between 1 and ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const history: ChatMessage[] = Array.isArray(body.history)
    ? body.history
        .filter(
          (item): item is ChatMessage =>
            Boolean(item) &&
            typeof item === "object" &&
            ((item as ChatMessage).role === "user" ||
              (item as ChatMessage).role === "assistant") &&
            typeof (item as ChatMessage).content === "string",
        )
        .slice(-MAX_HISTORY_ITEMS)
        .map(({ role, content }) => ({ role, content: content.slice(0, 4_000) }))
    : [];

  const chatbotUrl = process.env.KIRO_BACKEND_URL?.trim() || DEFAULT_CHATBOT_URL;
  let upstreamUrl: URL;
  try {
    upstreamUrl = new URL(chatbotUrl);
    const isLocalHttp =
      upstreamUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(upstreamUrl.hostname);
    if (upstreamUrl.protocol !== "https:" && !isLocalHttp) throw new Error("HTTPS is required.");
  } catch {
    return NextResponse.json({ error: "Chatbot endpoint configuration is invalid." }, { status: 500 });
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  const secretKey = process.env.KIRO_API_SECRET_KEY?.trim();
  if (secretKey) headers.set("Authorization", `Bearer ${secretKey}`);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, history }),
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });
    const responseBody = await upstreamResponse.text();

    try {
      return NextResponse.json(JSON.parse(responseBody), {
        status: upstreamResponse.status,
      });
    } catch {
      return NextResponse.json(
        { error: "Chatbot returned an invalid response." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[ask-kiel] Upstream request failed:", error);
    return NextResponse.json(
      { error: "Could not connect to the chatbot service." },
      { status: 502 },
    );
  }
}
