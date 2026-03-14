"use client";

import type { Personality } from "@/lib/personalities";
import { PERSONALITIES } from "@/lib/personalities";

export interface PersonalityPickerProps {
  /** List of personalities to show. Defaults to PERSONALITIES. */
  personalities?: readonly Personality[];
  /** Called when the user selects a personality. */
  onSelect: (personality: Personality) => void;
  /** Optional heading. */
  title?: string;
  /** Optional subheading. */
  description?: string;
  /** Optional class name for the root container. */
  className?: string;
}

export function PersonalityPicker({
  personalities = PERSONALITIES,
  onSelect,
  title = "Choose your companion",
  description = "Pick a personality and start chatting.",
  className,
}: PersonalityPickerProps) {
  return (
    <div
      className={
        className ??
        "flex min-h-screen flex-col items-center justify-center bg-background p-6"
      }
    >
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {personalities.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="font-medium text-foreground">{p.name}</span>
              <span className="text-sm text-muted-foreground">
                {p.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
