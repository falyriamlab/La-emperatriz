"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion, useInView } from "@/hooks/useInView";

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
 * IntersectionObserver logic). Under prefers-reduced-motion it shows `end`
 * directly, with no intermediate frames.
 *
 * Two copies of the number: the final value (shown only without JS, so the
 * static HTML never says "0") and the animated one (shown only under ".js").
 * Both are in the server HTML, so hydration matches either way.
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
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced || startedRef.current || !inView) return;
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
  }, [inView, reduced, end, duration, delayMs]);

  return (
    <span ref={ref} className={className} aria-live="off">
      <span className="js:hidden">
        {prefix}
        {end}
        {suffix}
      </span>
      <span className="hidden js:inline">
        {prefix}
        {reduced ? end : display}
        {suffix}
      </span>
    </span>
  );
}
