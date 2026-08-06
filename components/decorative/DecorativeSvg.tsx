import Image from "next/image";

type DecorativeSvgProps = {
  /** Path under /public, e.g. "/elements/stamp.svg" */
  src: string;
  /** Sizing + positioning classes for the wrapper (must include a size and, if absolute, a position). */
  className?: string;
  /** Classes for the <Image> itself, e.g. object-fit behavior. */
  imgClassName?: string;
};

/**
 * Purely decorative brand SVG (torn-star, hand illustrations, orbits, etc.).
 * Never focusable, never announced to assistive tech, never intercepts clicks —
 * these are visual accents only, layered behind or beside real content.
 */
export function DecorativeSvg({
  src,
  className = "",
  imgClassName = "object-contain",
}: DecorativeSvgProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <Image src={src} alt="" fill className={imgClassName} />
    </div>
  );
}
