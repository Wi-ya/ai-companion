import { ABPlayground, LearnHeader, TheoryPlaygroundTabs } from "@/components/lab";

const promptOptions = [
  {
    id: "princess",
    label: "Lonely Princess",
    prompt:
      "Write a short story about a lonely princess who lives in a castle in the clouds.",
  },
  {
    id: "advice",
    label: "Life Advice",
    prompt:
      "Give me one piece of advice for living a good life.",
  },
  {
    id: "poem",
    label: "Love Poem",
    prompt:
      "Write a short poem about falling in love for the first time.",
  },
];

export default function TemperatureLabPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LearnHeader
        title="Temperature Lab"
        subtitle="See how randomness changes output style and confidence."
      />
      <TheoryPlaygroundTabs
        theory={
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-semibold">Creativity vs. predictability</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Temperature</span> is
                a number — usually between 0 and 2 — that controls how randomly the
                model picks its next word. At every step, the model has a list of
                candidate words ranked by probability. Temperature decides how much
                it respects that ranking.
              </p>
              <p>
                <span className="font-medium text-foreground">Low temperature (e.g. 0.1)</span> — the
                model almost always picks the highest-probability word. Responses
                feel safe, predictable, and a bit generic. Ask it for a story about
                a princess and you'll get: <span className="italic">"Once upon a time, in a land far away, there lived a beautiful princess…"</span> — exactly what you'd expect.
              </p>
              <p>
                <span className="font-medium text-foreground">High temperature (e.g. 1.5–2.0)</span> — the
                model starts picking lower-ranked, surprising words. Responses feel
                more creative, poetic, or unpredictable — but can also go off the
                rails. The same princess story might open with: <span className="italic">"She counted clouds the way others count debts — obsessively, without relief."</span>
              </p>
              <p>
                Neither is better. Low temperature is great for factual tasks;
                high temperature suits creative writing. Temperature is probably the
                single strongest driver of perceived "personality" in a chatbot.
              </p>
              <div className="rounded-md border border-border bg-background p-3">
                <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-1">Try this</p>
                <p>Pick the "Lonely Princess" prompt. Set the left slider to <span className="font-mono">0.1</span> and the right to <span className="font-mono">1.8</span>. Notice how the left reads like a children's book template and the right goes somewhere unexpected.</p>
              </div>
            </div>
          </div>
        }
        playground={
          <ABPlayground
            title="A/B Temperature Playground"
            description="Two simultaneous generations, same prompt, different temperature. Try the presets or write your own."
            promptOptions={promptOptions}
            controls={[
              {
                key: "temperature",
                label: "Temperature",
                min: 0,
                max: 2,
                step: 0.1,
                leftDefault: 0.1,
                rightDefault: 1.8,
              },
            ]}
          />
        }
      />
    </main>
  );
}
