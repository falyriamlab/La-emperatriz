import Image from "next/image";
import type { ReactNode } from "react";
import { BASE_PATH } from "@/lib/basePath";

type SectionTagProps = {
  children: ReactNode;
};

/**
 * Small kicker/eyebrow label. Solid morado-oscuro pill guarantees legibility
 * (crema text on solid morado-oscuro = 6.8:1); the star-1 starburst is layered
 * on top as a subtle grunge texture at 12% opacity, not as the sole background —
 * the shape's jagged edges and transparent gaps mean stretching/cropping it to
 * fill an arbitrary text-width box leaves parts of the text with no backing
 * color at all. At 12% white-on-morado, worst case (directly over the star's
 * ink) still holds ~5:1 contrast, above the AA minimum.
 */
export function SectionTag({ children }: SectionTagProps) {
  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-morado-oscuro px-7 py-3">
      <Image
        src={`${BASE_PATH}/elements/star-1.svg`}
        alt=""
        fill
        aria-hidden="true"
        className="pointer-events-none object-cover opacity-[0.12] select-none"
      />
      <span className="relative z-10 text-sm font-bold tracking-[0.2em] text-crema">
        {children}
      </span>
    </span>
  );
}
