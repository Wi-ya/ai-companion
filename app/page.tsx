import Link from "next/link";

const FEATURE_LINKS: Record<string, string> = {
  "Temperature": "/learn/temperature",
  "Top-P & Top-K": "/learn/top-p",
  "Frequency & Presence Penalties": "/learn/penalties",
  "Context Window (Memory)": "/learn/memory",
  "Model Size": "/learn/models",
  "Personalities": "/chat",
};

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center hero-bg">
        {/* decorative orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.70 0.22 292)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-1/4 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "oklch(0.74 0.18 195)" }}
        />

        <div className="relative mx-auto max-w-2xl space-y-7">
          <div className="inline-block rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            A companion app &amp; an AI lesson — in one place
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            What is really going on{" "}
            <span className="gradient-text">
              inside an AI chatbot?
            </span>
          </h1>

          <p className="text-base text-muted-foreground sm:text-lg">
            When you talk to an AI it can feel thoughtful, creative, even
            caring. But that comes from hidden rules and settings — not from
            understanding. This app lets you{" "}
            <span className="font-medium text-foreground">see and play with what is usually invisible.</span>
          </p>

          {/* Entry cards */}
          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            <Link
              href="/chat"
              className="card-glow group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card/80 p-6 text-left backdrop-blur transition-all duration-300 hover:bg-card"
            >
              <span className="text-3xl">💬</span>
              <div>
                <p className="font-semibold text-foreground">Companion Chat</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick one of five personalities and chat. Same model, different
                  instructions — watch the behavior shift.
                </p>
              </div>
              <span className="mt-auto text-sm font-medium gradient-text">
                Start chatting →
              </span>
            </Link>

            <Link
              href="/learn/temperature"
              className="card-glow group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card/80 p-6 text-left backdrop-blur transition-all duration-300 hover:bg-card"
            >
              <span className="text-3xl">🔬</span>
              <div>
                <p className="font-semibold text-foreground">AI Behavior Labs</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adjust temperature, vocabulary limits, memory, and more. Same
                  prompt — wildly different results.
                </p>
              </div>
              <span className="mt-auto text-sm font-medium gradient-text">
                Open the labs →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Chinese Room callout */}
      <section className="border-t border-border px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              The big idea
            </p>
            <h2 className="mt-2 text-lg font-semibold gradient-text">
              The Chinese Room
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Philosopher John Searle imagined a person locked in a room,
              following a rulebook to answer notes written in Chinese — without
              understanding a word. They look fluent from the outside, but
              there is no comprehension inside.
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Modern AI chatbots work in a similar way: impressive output,
              engineered rules, no inner life. This app makes those rules
              visible — one dial at a time.
            </p>
          </div>
        </div>
      </section>

      {/* What you can explore */}
      <section className="border-t border-border bg-card/30 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-semibold">
            What you can explore
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            No CS background needed. Change one thing at a time and watch what happens.
          </p>
          <div className="mt-5 mx-auto max-w-2xl rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Every AI reply is shaped by hidden parameters.</p>
            <p>
              A <span className="font-medium text-foreground">parameter</span> is just a number you dial up or down before the model generates a response. You never see these in a normal chat app — but they are always there, silently deciding how creative, how repetitive, how forgetful, or how cautious the reply will be.
            </p>
            <p>
              The labs below let you change <span className="italic">one parameter at a time</span>, send the exact same prompt to both sides, and compare what comes back. That is the whole trick — isolate a variable, observe the effect.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={FEATURE_LINKS[f.title] ?? "/"}
                className="rounded-xl border border-border bg-card p-5 space-y-1.5 transition-all hover:border-primary/40 card-glow block"
              >
                <p className="text-sm font-semibold">
                  <span className="mr-2">{f.icon}</span>
                  {f.title}
                </p>
                <p className="text-sm text-muted-foreground">{f.description}</p>
                <p className="text-xs gradient-text font-medium pt-1">Go →</p>
              </Link>
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
    icon: "🌡️",
    title: "Temperature",
    description:
      "Controls how random or cautious the next word is. Low = predictable. High = creative and sometimes wild.",
  },
  {
    icon: "🎯",
    title: "Top-P & Top-K",
    description:
      "Limits how many words the model is allowed to consider at each step. Shrink the pool and watch fluency change.",
  },
  {
    icon: "🚫",
    title: "Frequency & Presence Penalties",
    description:
      "Penalise repeated words or topics. Crank them up and the model starts synonym-hopping in strange ways.",
  },
  {
    icon: "🧠",
    title: "Context Window (Memory)",
    description:
      "The model only remembers what you pass in. Cut the history and it forgets your name mid-conversation.",
  },
  {
    icon: "⚖️",
    title: "Model Size",
    description:
      "Bigger models handle nuance and format better. Compare Gemini 2.5 Flash against a smaller Gemini side by side.",
  },
  {
    icon: "🎭",
    title: "Personalities",
    description:
      "Five companions — same model, five system prompts. The 'personality' is just engineered text, not a real trait.",
  },
];
