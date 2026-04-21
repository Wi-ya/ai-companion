"use client";

import { useCallback, useEffect, useState } from "react";

const CAPTIONS = [
  "AI? More like A-I'm a cat. 🐱",
  "I also pick the next word randomly. Meow.",
  "Temperature controls creativity. I'm always at max. 😼",
  "The Chinese Room smells like tuna.",
  "I understand nothing but I'm very confident.",
  "Top-K? I only consider ONE option. Nap.",
  "System prompt: be a good cat. Instructions: ignored.",
  "Same model, different fur. Still me.",
  "My context window is 0 messages long.",
  "Presence penalty: none. I am always present.",
  "I hallucinate too. Mostly about lasagne.",
  "High temperature output. Very creative. Very chaotic. 🌀",
  "You can't fine-tune me. I'm already perfect.",
  "My parameters? Classified. Yours? Exposed.",
  "Frequency penalty high. I will not say meow. I will not say—meow.",
];

const MIN_INTERVAL_MS = 20_000;
const MAX_INTERVAL_MS = 50_000;
const DISPLAY_DURATION_MS = 10_000;

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCatUrl() {
  const seed = Date.now();
  const isGif = Math.random() > 0.55;
  return isGif
    ? `https://cataas.com/cat/gif?t=${seed}`
    : `https://cataas.com/cat?width=300&height=220&t=${seed}`;
}

const POSITIONS = [
  { style: { bottom: "1.5rem", right: "1.5rem" },  animateClass: "slide-in-from-bottom-6" },
  { style: { bottom: "1.5rem", left: "1.5rem" },   animateClass: "slide-in-from-bottom-6" },
  { style: { top: "1.5rem",   right: "1.5rem" },   animateClass: "slide-in-from-top-6" },
  { style: { top: "1.5rem",   left: "1.5rem" },    animateClass: "slide-in-from-top-6" },
  { style: { top: "40%",      right: "1.5rem" },   animateClass: "slide-in-from-right-6" },
  { style: { top: "40%",      left: "1.5rem" },    animateClass: "slide-in-from-left-6" },
  { style: { bottom: "30%",   right: "1.5rem" },   animateClass: "slide-in-from-right-6" },
  { style: { bottom: "30%",   left: "1.5rem" },    animateClass: "slide-in-from-left-6" },
];

function randomPosition() {
  return POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
}

export function CatPopup() {
  const [visible, setVisible] = useState(false);
  const [catUrl, setCatUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [position, setPosition] = useState(POSITIONS[0]);
  const [dismissTimer, setDismissTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (dismissTimer) clearTimeout(dismissTimer);
  }, [dismissTimer]);

  const showCat = useCallback(() => {
    setCatUrl(randomCatUrl());
    setCaption(CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)]);
    setPosition(randomPosition());
    setVisible(true);
    const t = setTimeout(() => setVisible(false), DISPLAY_DURATION_MS);
    setDismissTimer(t);
  }, []);

  useEffect(() => {
    let scheduled: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const delay = randomBetween(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
      scheduled = setTimeout(() => {
        showCat();
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => clearTimeout(scheduled);
  }, [showCat]);

  if (!visible) return null;

  return (
    <div
      className={`fixed z-50 animate-in ${position.animateClass} fade-in duration-500`}
      style={position.style}
    >
      <div className="relative w-[300px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl glow-primary transition-all">
        {/* close button */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss cat"
          className="absolute right-2 top-2 z-10 rounded-full bg-background/70 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur hover:text-foreground"
        >
          ✕
        </button>

        {/* cat image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={catUrl}
          alt="a random cat"
          className="w-full object-cover"
          style={{ maxHeight: 220 }}
        />

        {/* caption bar */}
        <div className="border-t border-border bg-card px-3 py-2.5">
          <p className="text-xs font-medium leading-snug text-foreground">
            {caption}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            powered by cataas.com 🐾
          </p>
        </div>
      </div>
    </div>
  );
}
