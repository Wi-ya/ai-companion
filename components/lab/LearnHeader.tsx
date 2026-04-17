"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LEARN_ROUTES } from "@/lib/learn";

interface LearnHeaderProps {
  title: string;
  subtitle: string;
}

export function LearnHeader({ title, subtitle }: LearnHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to main chat
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <nav className="mt-4 flex flex-wrap gap-2">
          {LEARN_ROUTES.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {route.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
