"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setIsDark(stored ? stored === "dark" : true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-lg shadow-lg backdrop-blur transition-all hover:scale-110 hover:border-primary/60 glow-primary"
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
