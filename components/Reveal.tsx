"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra wait (ms) before the entrance starts, to stagger nearby blocks. */
  delay?: number;
};

/**
 * Fades + slides content up as it scrolls into view. The `reveal-init` class
 * is a hard CSS-level fallback (see globals.css) that forces the visible
 * state under prefers-reduced-motion, even before this component hydrates —
 * the JS check in useInView is the second layer, for the animation itself.
 * `delay` only shifts the transition, so under reduced motion (no
 * transition at all) it has no effect.
 */
export function Reveal({ children, className = "", delay }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal-init transition-all duration-700 ease-out motion-reduce:transition-none ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}
