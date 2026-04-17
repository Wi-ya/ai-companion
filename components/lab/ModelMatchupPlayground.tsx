"use client";

import { useMemo, useState } from "react";
import type { PromptOption } from "@/lib/learn";

interface LabResult {
  text: string;
  meta: {
    model: string;
    provider: string;
  };
}

interface ModelOption {
  id: string;
  label: string;
  note: string;
}

const googleModels: ModelOption[] = [
  {
    id: "google:gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    note: "Latest — strongest reasoning and formatting",
  },
  {
    id: "google:gemini-2.0-flash-lite",
    label: "Gemini 2.0 Flash-Lite",
    note: "Smaller Google model — faster, less nuanced",
  },
];

const hfModels: ModelOption[] = [
  {
    id: "huggingface:microsoft/Phi-3-mini-4k-instruct",
    label: "Phi-3 Mini 4K (Microsoft)",
    note: "3.8B params — small but instruction-tuned",
  },
  {
    id: "huggingface:mistralai/Mistral-7B-Instruct-v0.3",
    label: "Mistral 7B Instruct",
    note: "7B open-source model — noticeably rawer than Gemini",
  },
  {
    id: "huggingface:TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    label: "TinyLlama 1.1B",
    note: "Tiny 1.1B model — bare minimum, very limited responses",
  },
];

const prompts: PromptOption[] = [
  {
    id: "argument",
    label: "Structured Argument",
    prompt:
      "Write a 4-step argument for why students should learn media literacy in the AI era.",
  },
  {
    id: "code-review",
    label: "Code Review Reasoning",
    prompt:
      "Given a function that is slow on large arrays, explain two likely causes and one fix for each cause.",
  },
];

export function ModelMatchupPlayground() {
  const [promptId, setPromptId] = useState(prompts[0].id);
  const [leftModelId, setLeftModelId] = useState(googleModels[0].id);
  const [rightModelId, setRightModelId] = useState(hfModels[1].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leftResult, setLeftResult] = useState<LabResult | null>(null);
  const [rightResult, setRightResult] = useState<LabResult | null>(null);

  const selectedPrompt = useMemo(
    () => prompts.find((prompt) => prompt.id === promptId) ?? prompts[0],
    [promptId]
  );

  const runComparison = async () => {
    setLoading(true);
    setError(null);
    setLeftResult(null);
    setRightResult(null);

    const payload = (modelId: string) => ({
      modelId,
      prompt: selectedPrompt.prompt,
      systemPrompt:
        "You are part of a model comparison lab. Be concise and format with short paragraphs.",
      temperature: 0.7,
    });

    try {
      const [leftRes, rightRes] = await Promise.all([
        fetch("/api/model-matchup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload(leftModelId)),
        }),
        fetch("/api/model-matchup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload(rightModelId)),
        }),
      ]);

      const [leftJson, rightJson] = await Promise.all([
        leftRes.json() as Promise<LabResult & { error?: string }>,
        rightRes.json() as Promise<LabResult & { error?: string }>,
      ]);

      if (!leftRes.ok || !rightRes.ok) {
        throw new Error(leftJson.error ?? rightJson.error ?? "Request failed");
      }

      setLeftResult(leftJson);
      setRightResult(rightJson);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Model size showdown</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Same prompt, two models, simultaneous generation. This includes a weaker
          model from a different API provider.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {prompts.map((prompt) => {
            const isActive = prompt.id === promptId;
            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => setPromptId(prompt.id)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {prompt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {([
          {
            side: "left",
            modelId: leftModelId,
            setModelId: setLeftModelId,
            result: leftResult,
          },
          {
            side: "right",
            modelId: rightModelId,
            setModelId: setRightModelId,
            result: rightResult,
          },
        ] as const).map((column) => {
          const optionList = column.side === "left" ? googleModels : hfModels;
          const allModels = [...googleModels, ...hfModels];
          return (
          <div key={column.side} className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {column.side === "left" ? "Left — Google Model" : "Right — Hugging Face Model"}
            </h3>
            <select
              value={column.modelId}
              onChange={(event) => column.setModelId(event.target.value)}
              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {optionList.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              {allModels.find((model) => model.id === column.modelId)?.note}
            </p>

            <div className="mt-4 rounded-md border border-border bg-background p-3 text-sm">
              {column.result ? (
                <>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {column.result.meta.model} via {column.result.meta.provider}
                  </p>
                  <p className="whitespace-pre-wrap">{column.result.text}</p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Output appears here after running the comparison.
                </p>
              )}
            </div>
          </div>
          );
        })}
      </div>

      <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
        Left uses <code>GOOGLE_GENERATIVE_AI_API_KEY</code>. Right uses{" "}
        <code>HUGGINGFACE_API_KEY</code> — get a free token at huggingface.co/settings/tokens.
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={runComparison}
          disabled={loading}
          className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating both sides..." : "Run model showdown"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
