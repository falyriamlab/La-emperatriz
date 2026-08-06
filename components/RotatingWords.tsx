"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/hooks/useInView";

type RotatingWordsProps = {
  words: string[];
  intervalMs?: number;
  className?: string;
};

/**
 * Cycles through `words`, one at a time, every `intervalMs`.
 *
 * - The auto-rotating word is `aria-hidden` — an aria-live region that
 *   re-announces itself every 5s would be disruptive, not helpful. Screen
 *   readers instead get the full list as plain, static text (visually
 *   hidden), so no information is lost.
 * - Under prefers-reduced-motion the rotation never starts at all: per
 *   WCAG 2.2.2, auto-updating content that runs longer than 5s needs a way
 *   to stop it, so reduced-motion users just get the full static list
 *   (comma-separated, same as before this component existed) instead of a
 *   moving target with no pause control.
 */
export function RotatingWords({
  words,
  intervalMs = 5000,
  className = "",
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reduced || words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [reduced, words, intervalMs]);

  if (reduced) {
    return <span className={className}>{words.join(", ")}</span>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        key={index}
        aria-hidden="true"
        className="inline-block motion-safe:[animation:fade-in_0.4s_ease-out]"
      >
        {words[index]}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
