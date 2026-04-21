import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            A companion app &amp; an AI lesson — in one place
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            What is really going on <br className="hidden sm:block" />
            inside an AI chatbot?
          </h1>

          <p className="text-base text-muted-foreground sm:text-lg">
            When you talk to an AI assistant it can feel thoughtful, caring, or
            creative. But that feeling comes from hidden rules and settings —
            not from understanding. This app lets you see and play with what is
            usually invisible.
          </p>

          {/* Chinese Room callout */}
          <div className="rounded-xl border border-border bg-card p-5 text-left text-sm text-muted-foreground">
            <p className="font-medium text-foreground">The Chinese Room idea</p>
            <p className="mt-2">
              Philosopher John Searle imagined a person locked in a room,
              following a rulebook to answer notes written in Chinese — without
              understanding a word. They look fluent from the outside, but
              there is no real comprehension inside. Modern AI chatbots work in
              a similar way: impressive output, engineered rules, no inner life.
            </p>
            <p className="mt-2">
              This app makes those rules visible. You will chat with five
              "personalities" that are actually the same model with different
              instructions, and explore the hidden dials that shape every
              response.
            </p>
          </div>

          {/* Entry points */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <Link
              href="/chat"
              className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-6 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="text-2xl">💬</span>
              <span className="font-semibold">Companion Chat</span>
              <span className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                Pick one of five personalities and chat. Same model, different
                instructions — see how the behavior changes.
              </span>
              <span className="mt-auto pt-2 text-sm font-medium">
                Start chatting →
              </span>
            </Link>

            <Link
              href="/learn/temperature"
              className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-6 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="text-2xl">🔬</span>
              <span className="font-semibold">AI Behavior Labs</span>
              <span className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                Adjust temperature, vocabulary limits, memory, and more.
                Watch the same prompt produce completely different outputs.
              </span>
              <span className="mt-auto pt-2 text-sm font-medium">
                Open the labs →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* What you can explore */}
      <section className="border-t border-border bg-card px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-semibold">
            What you can explore
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            No CS background needed. Change one thing at a time and watch what
            happens.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-background p-5 space-y-1"
              >
                <p className="font-medium text-sm">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-5 text-center text-xs text-muted-foreground">
        Powered by Google Gemini via Vercel AI SDK · Built for HUM&nbsp;220
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    title: "Temperature",
    description:
      "Controls how random or cautious the next word is. Low = predictable. High = creative and sometimes wild.",
  },
  {
    title: "Top-P & Top-K",
    description:
      "Limits how many words the model is allowed to consider at each step. Shrink the pool and watch fluency change.",
  },
  {
    title: "Frequency & Presence Penalties",
    description:
      "Penalise repeated words or topics. Crank them up and the model starts synonym-hopping in strange ways.",
  },
  {
    title: "Context Window (Memory)",
    description:
      "The model only remembers what you pass in. Cut the history and it forgets your name mid-conversation.",
  },
  {
    title: "Model Size",
    description:
      "Bigger models handle nuance and format better. Compare Gemini 2.5 Flash against a tiny 1B model side by side.",
  },
  {
    title: "Personalities",
    description:
      "Five companions — same model, five system prompts. The 'personality' is just engineered text, not a real trait.",
  },
];
