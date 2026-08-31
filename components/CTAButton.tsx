import type { ReactNode } from "react";
import { MdArrowForward } from "react-icons/md";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  /** Which section background this sits on — picks the accent/text pairing. */
  surface?: "light" | "dark";
  className?: string;
  target?: string;
  rel?: string;
};

// Wipe-on-hover pattern: a solid resting background on the button itself,
// covered on hover by an absolutely-positioned layer that scales in from
// the left edge (transform-only, GPU-accelerated — never width/left).
// Two arrows cross-fade via opacity + transform (never layout) instead of
// one arrow sliding across the button.
//
// Both arrows live stacked in a single grid cell (one reserved icon slot,
// not two flanking the label): reserving a slot on *both* sides of the
// label — even with the inactive side at opacity-0 — leaves a "dead" gap
// on whichever side isn't currently visible, since opacity doesn't free
// the layout space. That dead gap is invisible but still pushes the
// visible icon+label cluster off-center within the button's symmetric
// padding. A single slot means the flex content IS the visible content,
// so centering falls out of the symmetric px-6 padding for free.
//
// Reduced motion: the *state* classes (group-hover:scale-x-100,
// group-hover:opacity-*, group-hover:text-*) are never gated behind
// motion-safe:, so hover still does its job — only the `transition-*`
// utilities are motion-safe-only. Under prefers-reduced-motion the browser
// has no transition to animate, so hover snaps straight to its end state.
//
// Contrast: light-surface rest and dark-surface hover both land on the
// same coral+crema pairing — 3.73:1. That fails AA for normal text (4.5:1)
// but clears the "large text / UI component" threshold (3:1). Both other
// pairings (light-hover: crema/morado-oscuro 6.81:1, dark-rest:
// morado-oscuro/amarillo 4.65:1) pass AA normal-text. Pre-existing
// trade-off carried over from the previous button design, not new here.
const surfaceStyles: Record<
  NonNullable<CTAButtonProps["surface"]>,
  { restBg: string; wipeBg: string; text: string; textHover: string }
> = {
  light: {
    restBg: "bg-coral",
    wipeBg: "bg-morado-oscuro",
    text: "text-crema",
    // Already crema on both rest and hover — no recolor needed.
    textHover: "",
  },
  dark: {
    restBg: "bg-amarillo",
    wipeBg: "bg-coral",
    text: "text-morado-oscuro",
    textHover: "group-hover:text-crema",
  },
};

export function CTAButton({
  href,
  children,
  surface = "light",
  className = "",
  target,
  rel,
}: CTAButtonProps) {
  const s = surfaceStyles[surface];

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-4 ${s.restBg} ${className}`}
    >
      {/* Wipe layer: hidden at rest, covers the button on hover. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left scale-x-0 rounded-[inherit] group-hover:scale-x-100 motion-safe:transition-transform motion-safe:duration-[350ms] motion-safe:ease-out ${s.wipeBg}`}
      />

      {/* Icon slot: a single h-4 w-4 reserved space, both arrow states
          stacked in the same grid cell and cross-fading in place — see
          the centering note above. */}
      <span className="relative z-10 grid h-4 w-4 place-items-center">
        {/* Arrow "reposo" — visible at rest, fades/slides out on hover. */}
        <MdArrowForward
          aria-hidden="true"
          className={`col-start-1 row-start-1 h-4 w-4 group-hover:-translate-x-1 group-hover:opacity-0 motion-safe:transition-[opacity,transform] motion-safe:duration-[350ms] motion-safe:ease-out ${s.text} ${s.textHover}`}
        />
        {/* Arrow "hover" — arrives sliding in from the left, replacing it. */}
        <MdArrowForward
          aria-hidden="true"
          className={`col-start-1 row-start-1 h-4 w-4 translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-[350ms] motion-safe:ease-out ${s.text} ${s.textHover}`}
        />
      </span>

      {/* Label */}
      <span
        className={`relative z-10 text-base font-bold motion-safe:transition-colors motion-safe:duration-[350ms] motion-safe:ease-out ${s.text} ${s.textHover}`}
      >
        {children}
      </span>
    </a>
  );
}
