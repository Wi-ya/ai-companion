export interface LearnRoute {
  href: string;
  title: string;
}

export const LEARN_ROUTES: LearnRoute[] = [
  { href: "/learn/temperature", title: "Temperature" },
  { href: "/learn/top-p", title: "Top-P / Top-K" },
  { href: "/learn/penalties", title: "Penalties" },
  { href: "/learn/memory", title: "Memory" },
  { href: "/learn/models", title: "Model Internals 🚧" },
];

export interface PromptOption {
  id: string;
  label: string;
  prompt: string;
}
