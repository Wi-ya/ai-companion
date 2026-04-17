"use client";

import { useState } from "react";

interface TheoryPlaygroundTabsProps {
  theory: React.ReactNode;
  playground: React.ReactNode;
}

export function TheoryPlaygroundTabs({
  theory,
  playground,
}: TheoryPlaygroundTabsProps) {
  const [tab, setTab] = useState<"theory" | "playground">("theory");

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("theory")}
          className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
            tab === "theory"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          Theory
        </button>
        <button
          type="button"
          onClick={() => setTab("playground")}
          className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
            tab === "playground"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          Playground
        </button>
      </div>

      {tab === "theory" ? theory : playground}
    </section>
  );
}
