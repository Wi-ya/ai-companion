"use client";

import { Button } from "@/components/ui/button";
import type { Personality } from "@/lib/personalities";

/** Minimal message shape so ChatView can be used with different chat backends. */
export interface ChatMessage {
  id: string;
  role: string;
  parts: Array<{ type: string; text?: string }>;
}

export interface ChatViewProps {
  personality: Personality;
  messages: ChatMessage[];
  sendMessage: (
    message: { text: string },
    options?: { body?: Record<string, unknown> }
  ) => void;
  status: string;
  error: Error | undefined;
  onBack: () => void;
  /** Optional class name for the root container. */
  className?: string;
}

export function ChatView({
  personality,
  messages,
  sendMessage,
  status,
  error,
  onBack,
  className,
}: ChatViewProps) {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector<HTMLInputElement>('input[name="message"]');
    const text = input?.value?.trim();
    if (!text) return;
    sendMessage(
      { text },
      { body: { personalityId: personality.id } }
    );
    if (input) input.value = "";
  };

  return (
    <div
      className={
        className ?? "flex min-h-screen flex-col bg-background"
      }
    >
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground"
            >
              ← Change personality
            </Button>
            <span className="text-sm font-medium text-foreground">
              {personality.name}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-12">
            <p className="text-muted-foreground">
              Say something to {personality.name.toLowerCase()}…
            </p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <div className="whitespace-pre-wrap break-words text-sm">
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <span key={`${message.id}-${i}`}>{part.text ?? ""}</span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            Something went wrong. Try again.
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <input
              name="message"
              type="text"
              placeholder="Type a message…"
              disabled={status !== "ready"}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
            <Button type="submit" disabled={status !== "ready"}>
              {status === "streaming" || status === "submitted" ? "…" : "Send"}
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
}
