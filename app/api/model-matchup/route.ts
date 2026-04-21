import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

interface ModelRequestBody {
  prompt: string;
  systemPrompt?: string;
  modelId: string;
  temperature?: number;
}

const DEFAULT_SYSTEM =
  "You are an assistant for an AI behavior lab. Keep responses concise.";

function getNumeric(value: unknown, fallback: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return num;
}

async function generateWithHuggingFace(body: ModelRequestBody) {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key) {
    throw new Error(
      "HUGGINGFACE_API_KEY is missing. Add it to .env.local to use the Hugging Face model."
    );
  }

  const modelName = body.modelId.replace("huggingface:", "");
  const fullPrompt = `${body.systemPrompt ?? DEFAULT_SYSTEM}\n\nUser: ${body.prompt}\nAssistant:`;

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${modelName}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 300,
          temperature: getNumeric(body.temperature, 0.7),
          return_full_text: false,
        },
      }),
    }
  );

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    if (response.status === 503) {
      throw new Error(
        "The Hugging Face model is still loading. Wait 20–30 seconds and try again."
      );
    }
    throw new Error(
      `Hugging Face returned an unexpected response (HTTP ${response.status}). The model may be unavailable.`
    );
  }

  const payload = (await response.json()) as
    | Array<{ generated_text?: string }>
    | { error?: string; estimated_time?: number };

  if (!response.ok || "error" in payload) {
    const msg =
      "error" in payload ? payload.error : "Hugging Face request failed.";
    const eta =
      "estimated_time" in payload && payload.estimated_time
        ? ` (estimated wait: ${Math.ceil(payload.estimated_time)}s)`
        : "";
    throw new Error((msg ?? "Hugging Face request failed.") + eta);
  }

  const text = Array.isArray(payload)
    ? payload[0]?.generated_text?.trim()
    : undefined;

  if (!text) {
    throw new Error("Hugging Face returned an empty response.");
  }

  return {
    text,
    meta: {
      model: modelName,
      provider: "huggingface",
    },
  };
}

async function generateWithGoogle(body: ModelRequestBody) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing.");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const modelName = body.modelId.replace("google:", "");
  const result = await generateText({
    model: google(modelName),
    system: body.systemPrompt ?? DEFAULT_SYSTEM,
    prompt: body.prompt,
    temperature: getNumeric(body.temperature, 0.7),
  });

  return {
    text: result.text,
    meta: {
      model: modelName,
      provider: "google",
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ModelRequestBody;
    if (!body.prompt || !body.modelId) {
      return Response.json(
        { error: "Missing prompt or modelId for model matchup." },
        { status: 400 }
      );
    }

    if (body.modelId.startsWith("huggingface:")) {
      const output = await generateWithHuggingFace(body);
      return Response.json(output);
    }

    if (body.modelId.startsWith("google:")) {
      const output = await generateWithGoogle(body);
      return Response.json(output);
    }

    return Response.json({ error: "Unsupported model provider." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: `Model matchup generation failed: ${message}` },
      { status: 500 }
    );
  }
}
