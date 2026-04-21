import { ABPlayground, LearnHeader, TheoryPlaygroundTabs } from "@/components/lab";

const promptOptions = [
  {
    id: "sky",
    label: "Describe the Sky",
    prompt:
      "Describe what the sky looks like on a clear summer afternoon.",
  },
  {
    id: "happy",
    label: "What is Happiness?",
    prompt:
      "In two or three sentences, describe what happiness feels like.",
  },
  {
    id: "dog",
    label: "Loyal Dog",
    prompt:
      "Describe a loyal dog waiting for its owner to come home.",
  },
];

export default function TopPLabPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LearnHeader
        title="Top-P / Top-K Lab"
        subtitle="Constrain vocabulary candidates and observe fluency changes."
      />
      <TheoryPlaygroundTabs
        theory={
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-semibold">Vocabulary restriction controls</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                At every word, the model secretly ranks thousands of possible next
                words by probability. <span className="font-medium text-foreground">Top-P</span> and{" "}
                <span className="font-medium text-foreground">Top-K</span> are two ways
                to shrink that list before the model picks.
              </p>
              <p>
                <span className="font-medium text-foreground">Top-P (nucleus sampling)</span> — keep
                only the smallest group of words whose probabilities add up to P.
                With Top-P = 0.9, the model considers only the words that together
                account for 90% of the probability mass. With Top-P = 0.1, it is
                restricted to a tiny handful of the most likely words — responses
                become very flat and repetitive.
              </p>
              <p>
                <span className="font-medium text-foreground">Top-K</span> — simply
                cut the list off at K words, regardless of their probabilities.
                Top-K = 1 means the model always picks the single most likely word —
                no randomness at all. Top-K = 40 gives it a wide vocabulary to draw from.
              </p>
              <p>
                Ask the model to describe the sky with Top-P = 0.1 and you'll get: <span className="italic">"The sky is blue and clear. The sun is bright. The sky is very blue."</span> — repetitive because it has almost no word choices. Open it up and you get richer language.
              </p>
              <div className="rounded-md border border-border bg-background p-3">
                <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-1">Try this</p>
                <p>Use "Describe the Sky". Set left to Top-P <span className="font-mono">0.1</span> / Top-K <span className="font-mono">3</span> and right to Top-P <span className="font-mono">0.95</span> / Top-K <span className="font-mono">40</span>. The left will sound robotic; the right will sound natural.</p>
              </div>
            </div>
          </div>
        }
        playground={
          <ABPlayground
            title="A/B Top-P and Top-K Playground"
            description="Generate both sides together to compare constrained vs. flexible wording. Try your own prompt too."
            promptOptions={promptOptions}
            controls={[
              {
                key: "topP",
                label: "Top-P",
                min: 0.1,
                max: 1,
                step: 0.05,
                leftDefault: 0.1,
                rightDefault: 0.95,
              },
              {
                key: "topK",
                label: "Top-K",
                min: 1,
                max: 50,
                step: 1,
                leftDefault: 3,
                rightDefault: 40,
              },
            ]}
          />
        }
      />
    </main>
  );
}
