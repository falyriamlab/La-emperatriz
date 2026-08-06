"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useInView } from "@/hooks/useInView";

type CountUpProps = {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  /** Stagger the start of the count relative to sibling CountUps. */
  delayMs?: number;
  className?: string;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts up from 0 to `end` via requestAnimationFrame once the element
 * scrolls into view (via the shared useInView hook — no duplicate
 * IntersectionObserver logic). Under prefers-reduced-motion it renders
 * `end` immediately from the first render (lazy init, matching the same
 * reduced-motion pattern as useInView/Reveal — and avoiding a
 * setState-in-effect render cascade), with no intermediate frames and no
 * dependency on scroll position, same as Reveal's own reduced-motion path.
 */
export function CountUp({
  end,
  duration = 1500,
  suffix = "",
  prefix = "",
  delayMs = 0,
  className = "",
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(() =>
    prefersReducedMotion() ? end : 0,
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion() || startedRef.current || !inView) return;
    startedRef.current = true;

    let raf = 0;
    const timeoutId = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setDisplay(Math.round(easeOutCubic(t) * end));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(raf);
    };
  }, [inView, end, duration, delayMs]);

  return (
    <span ref={ref} className={className} aria-live="off">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
