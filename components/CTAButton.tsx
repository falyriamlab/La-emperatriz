import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  /** Which section background this sits on — picks the accent/text pairing. */
  surface?: "light" | "dark";
  className?: string;
  target?: string;
  rel?: string;
};

// higherlifefoundation.org-style "icon square → pill" pattern, in Puente's
// colors. Structure:
//   1. an absolutely-positioned pill (accent bg) that grows from the square
//      via scale-x (transform, not width/padding — GPU-accelerated), and
//   2. a persistent accent-colored square with the arrow, always visible,
//      so the button reads correctly even with no hover/JS/motion.
// The whole hover behavior (pill growth, arrow shift, label recolor) is
// motion-safe-only: under prefers-reduced-motion the button stays in its
// resting state, where label-vs-page-background contrast is a comfortable
// 6.8:1 on both surfaces. (The hover state's label-on-accent contrast is
// coral/crema = 3.73:1 — fails AA for normal text, passes for large
// text/UI components. That's the same coral+crema pairing already used
// for every primary button on the site; not a new regression, but worth
// flagging. amarillo/morado-oscuro on the dark surface passes at 4.64:1.)
const SQUARE = "h-14 w-14";

const surfaceStyles: Record<
  NonNullable<CTAButtonProps["surface"]>,
  { square: string; arrow: string; textDefault: string; textHover: string }
> = {
  light: {
    square: "bg-coral",
    arrow: "text-crema",
    textDefault: "text-morado-oscuro",
    textHover: "motion-safe:group-hover:text-crema",
  },
  dark: {
    square: "bg-amarillo",
    arrow: "text-morado-oscuro",
    textDefault: "text-crema",
    textHover: "motion-safe:group-hover:text-morado-oscuro",
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
      className={`group relative inline-flex items-center gap-3 rounded-xl ${className}`}
    >
      {/* Growing pill: 0-width at rest, scales from the square to cover the
          label on hover. transform-only so it's GPU-accelerated. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left scale-x-0 rounded-xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-x-100 ${s.square}`}
      />

      {/* Persistent square + arrow — always visible, independent of hover. */}
      <span
        className={`relative z-10 flex ${SQUARE} flex-none items-center justify-center rounded-xl ${s.square}`}
      >
        <span
          aria-hidden="true"
          className={`motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:translate-x-1 ${s.arrow}`}
        >
          →
        </span>
      </span>

      {/* Label — no background of its own; sits on the page at rest, on the
          expanded pill on hover, recoloring in sync to keep contrast. */}
      <span
        className={`relative z-10 pr-5 text-base font-bold motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-out ${s.textDefault} ${s.textHover}`}
      >
        {children}
      </span>
    </a>
  );
}
