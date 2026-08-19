import Image from "next/image";

type DecorativeSvgProps = {
  /** Path under /public, e.g. "/elements/stamp.svg" */
  src: string;
  /** Intrinsic pixel size of the source SVG (its own width/height attributes) — sets the aspect ratio, same as Header's logo <Image>. */
  width: number;
  height: number;
  /** Positioning/visibility/opacity classes for the wrapper (e.g. "absolute -top-10 -right-10 hidden sm:block"). */
  className?: string;
  /** Sizing classes for the <Image> itself — fix ONE dimension (h-* or w-*) and leave the other on "auto" so it scales without distortion, same as Header's `h-5 w-auto sm:h-6`. */
  imgClassName?: string;
};

/**
 * Purely decorative brand SVG (torn-star, hand illustrations, orbits, etc.).
 * Never focusable, never announced to assistive tech, never intercepts clicks —
 * these are visual accents only, layered behind or beside real content.
 *
 * Sized like Header's logo: explicit width/height (not `fill`), so Next.js
 * knows the real aspect ratio up front (no layout shift while it loads) and
 * a single CSS dimension drives the rendered size with the other on auto —
 * never a fixed height+width box that squeezes/crops a mismatched aspect ratio.
 */
export function DecorativeSvg({
  src,
  width,
  height,
  className = "",
  imgClassName = "",
}: DecorativeSvgProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <Image src={src} alt="" width={width} height={height} className={imgClassName} />
    </div>
  );
}
