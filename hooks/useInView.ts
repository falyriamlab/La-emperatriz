"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** One-off check, for event handlers (never during render). */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * prefers-reduced-motion for use during render. The server (and hydration)
 * always sees `false`; the real value is applied right after hydration.
 * Reading matchMedia in a lazy useState initializer instead would make the
 * first client render differ from the static HTML — a hydration mismatch
 * for every reduced-motion visitor.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/**
 * Tracks whether an element has scrolled into the viewport, once.
 * Reports "in view" (no observing needed) when the user prefers reduced
 * motion, so callers can skip the reveal animation entirely.
 */
export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per mount; pass a stable options object
  }, []);

  return { ref, inView: reduced || seen };
}
