import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getPersonalityById } from "@/lib/personalities";

export const maxDuration = 30;

const DEFAULT_SYSTEM_PROMPT = `You are a friendly, helpful AI companion. You're kind, concise, and conversational. Keep responses clear and not too long.`;

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response(
      "GOOGLE_GENERATIVE_AI_API_KEY is not set. Add it to .env in ai-companion and run npm run dev from ai-companion.",
      { status: 500 }
    );
  }

  const body = await req.json();
  const { messages, personalityId }: { messages: UIMessage[]; personalityId?: string } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response("Missing or invalid messages", { status: 400 });
  }

  const personality = personalityId ? getPersonalityById(personalityId) : undefined;
  const systemPrompt = personality?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;

  try {
    const google = createGoogleGenerativeAI({ apiKey });
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/chat]", message);
    return new Response(
      JSON.stringify({ error: "Chat request failed", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
