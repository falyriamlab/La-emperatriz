"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useInView";

type RotatingWordsProps = {
  words: string[];
  intervalMs?: number;
  className?: string;
};

/**
 * Cycles through `words`, one at a time, every `intervalMs`.
 *
 * - The visible word is `aria-hidden` — an aria-live region that
 *   re-announces itself every few seconds would be disruptive, not helpful.
 *   Screen readers instead get the full list as plain, static text
 *   (visually hidden), so no information is lost.
 * - Under prefers-reduced-motion the rotation never starts: per WCAG 2.2.2,
 *   auto-updating content that runs longer than 5s needs a way to stop it,
 *   so reduced-motion users get one fixed word. A single word always fits
 *   the stat's fixed-height slot (the whole list didn't, and overlapped the
 *   label below it).
 * - The server HTML and the first client render are identical (first word,
 *   no rotation); rotation only starts after hydration.
 */
export function RotatingWords({
  words,
  intervalMs = 5000,
  className = "",
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [reduced, words, intervalMs]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        key={reduced ? 0 : index}
        aria-hidden="true"
        className="inline-block whitespace-nowrap motion-safe:[animation:fade-in_0.4s_ease-out]"
      >
        {words[reduced ? 0 : index]}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
