"use client";

import { useState } from "react";

interface LabResult {
  text: string;
  meta: {
    model: string;
    provider: string;
  };
}

interface ScriptMessage {
  role: "user" | "assistant";
  text: string;
}

const script: ScriptMessage[] = [
  { role: "user", text: "Call me Alex in this conversation." },
  { role: "assistant", text: "Got it, Alex. I will remember that." },
  { role: "user", text: "I am preparing a marine biology presentation for Friday." },
  {
    role: "assistant",
    text: "Nice, Alex. I can help with a clear presentation outline.",
  },
  { role: "user", text: "My chosen species is the giant Pacific octopus." },
  {
    role: "assistant",
    text: "Great choice. It has fascinating behavior and camouflage skills.",
  },
];

const finalQuestion = "What is my name and what species did I choose?";

function toUiMessages(messages: ScriptMessage[]) {
  return messages.map((message, index) => ({
    id: `memory-${index}`,
    role: message.role,
    parts: [{ type: "text", text: message.text }],
  }));
}

export function MemoryPlayground() {
  const [leftWindow, setLeftWindow] = useState(1);
  const [rightWindow, setRightWindow] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leftResult, setLeftResult] = useState<LabResult | null>(null);
  const [rightResult, setRightResult] = useState<LabResult | null>(null);

  const runComparison = async () => {
    setLoading(true);
    setError(null);
    setLeftResult(null);
    setRightResult(null);

    const makePayload = (windowSize: number) => {
      const sliced = script.slice(-windowSize);
      const uiMessages = [
        ...toUiMessages(sliced),
        {
          id: "memory-final-question",
          role: "user",
          parts: [{ type: "text", text: finalQuestion }],
        },
      ];
      return {
        systemPrompt:
          "You are in a memory experiment. Answer the final question directly in 1-2 sentences.",
        messages: uiMessages,
        settings: {
          temperature: 0.4,
        },
      };
    };

    try {
      const [leftRes, rightRes] = await Promise.all([
        fetch("/api/lab", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(makePayload(leftWindow)),
        }),
        fetch("/api/lab", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(makePayload(rightWindow)),
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
        <h2 className="text-lg font-semibold">Context window playground</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          No live typing here. The transcript is fixed and only the visible-message
          window changes.
        </p>

        <div className="mt-3 rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Fixed transcript:</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {script.map((message, index) => (
              <li key={`${message.role}-${index}`}>
                <span className="font-medium">{message.role}:</span> {message.text}
              </li>
            ))}
            <li className="pt-1">
              <span className="font-medium">final user question:</span> {finalQuestion}
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {([
          { side: "left", value: leftWindow, setter: setLeftWindow, result: leftResult },
          {
            side: "right",
            value: rightWindow,
            setter: setRightWindow,
            result: rightResult,
          },
        ] as const).map((column) => (
          <div key={column.side} className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {column.side === "left" ? "Left Memory" : "Right Memory"}
            </h3>
            <label className="mt-3 block text-sm">
              <div className="mb-1 flex items-center justify-between">
                <span>Messages visible to model</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {column.value}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={script.length}
                step={1}
                value={column.value}
                onChange={(event) => column.setter(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              Context passed: last {column.value} scripted messages + final user
              question.
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
                  Output appears here after running comparison.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={runComparison}
          disabled={loading}
          className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating both sides..." : "Run memory comparison"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
