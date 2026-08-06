"use client";

import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Tracks whether an element has scrolled into the viewport, once.
 * Immediately reports "in view" (no observing) when the user prefers
 * reduced motion, so callers can skip the reveal animation entirely.
 */
export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T | null>(null);
  // Lazy init reads the media query once at mount, so reduced-motion users
  // never trigger a synchronous setState-in-effect render cascade.
  const [inView, setInView] = useState(prefersReducedMotion);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per mount; pass a stable options object
  }, []);

  return { ref, inView };
}
