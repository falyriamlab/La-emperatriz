"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Fades + slides content up as it scrolls into view. The `reveal-init` class
 * is a hard CSS-level fallback (see globals.css) that forces the visible
 * state under prefers-reduced-motion, even before this component hydrates —
 * the JS check in useInView is the second layer, for the animation itself.
 */
export function Reveal({ children, className = "" }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal-init transition-all duration-700 ease-out motion-reduce:transition-none ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}
