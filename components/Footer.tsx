"use client";

import Image from "next/image";
import { CopyableEmail } from "@/components/CopyableEmail";
import { CTAButton } from "@/components/CTAButton";
import { useInView } from "@/hooks/useInView";
import { BASE_PATH } from "@/lib/basePath";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { BOOKING_LINK } from "@/lib/links";

// Muted secondary text throughout this footer uses /70 (not the /40-/60
// the umanodesign.studio reference gets away with on plain white) — crema
// is warmer/darker than pure white, so those lighter opacities land under
// 3:1 against it. /70 clears AA (4.5:1) even at text-xs. See contrast
// notes below each block for the exact ratios.
const MUTED = "text-negro/70";

export function Footer() {
  const { t } = useLanguage();
  // Same IntersectionObserver hook Reveal.tsx uses elsewhere — no
  // scroll-linked JS, just a one-shot "has this scrolled into view yet"
  // flag. Reduced motion is handled inside the hook itself (inView starts
  // `true` immediately when prefers-reduced-motion is set), so the
  // unconditional translate/opacity classes below already land on their
  // final state with no transition to skip.
  const { ref, inView } = useInView<HTMLElement>();

  return (
    // relative + z-10 + rounded-t-[...]: the covering edge reads as the
    // start of a new "page" against FinalCTA's rounded-b-[...] above.
    // Solid bg-crema (not translucent) so it isn't see-through.
    <footer
      ref={ref}
      className={`relative z-10 rounded-t-[2rem] bg-crema px-6 py-14 motion-safe:transition-all motion-safe:duration-[600ms] motion-safe:ease-out sm:rounded-t-[3rem] sm:px-10 lg:rounded-t-[4rem] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-70"
      }`}
    >
      <div className="mx-auto max-w-5xl">
        {/* Two-card row — dark brand card + light contact card, same height,
            barely touching (small gap), sitting above the giant email via z-20.
            pointer-events-none on both cards + pointer-events-auto back on
            each real link/button: where a card's own background geometrically
            overlaps the email button below (the "tucked behind" effect further
            down), clicks fall through to it instead of being swallowed by the
            card's non-interactive padding/background. */}
        <div className="relative z-20 flex flex-col gap-3 pointer-events-none sm:flex-row sm:items-stretch">
          {/* Left card: morado-oscuro bg, crema text — 6.81:1, passes AA.
              overflow-hidden as a safety net + break-words on the tagline:
              at narrow sm:w-[34%] widths a single long word ("iberoamericanas.")
              can fail to wrap and spill past the card's own rounded edge. */}
          <div className="flex flex-col justify-between gap-10 overflow-hidden rounded-3xl bg-morado-oscuro p-8 sm:w-[34%]">
            <Image
              src={`${BASE_PATH}/logo/logo-horizontal-crema.svg`}
              alt={t.header.logoAlt}
              width={666}
              height={102}
              className="h-6 w-auto"
            />
            <p className="font-display text-2xl leading-[1.2] font-semibold text-crema italic break-words sm:text-3xl">
              {t.footer.tagline[0]}
              <br />
              {t.footer.tagline[1]}
            </p>
          </div>

          {/* Right card: crema bg, morado-oscuro text — 6.81:1, passes AA.
              min-w-0: flex-1 alone doesn't let a flex item shrink below its
              content's intrinsic width (min-width:auto default) — same
              class of bug as CopyableEmail's own min-w-0, just one level up. */}
          <div className="flex min-w-0 flex-1 flex-col rounded-3xl border border-morado-oscuro/10 bg-white/70 p-8">
            {/* min-w-0 here too: this card is itself `flex flex-col`, so this
                row and the bottom row below are ITS flex items — the same
                min-width:auto default applies at every flex-item level, not
                just the outermost one. */}
            <div className="flex min-w-0 flex-col gap-8 sm:flex-row sm:justify-between">
              <div className="min-w-0">
                <h3 className={`text-xs font-bold tracking-wide uppercase ${MUTED}`}>
                  {t.footer.contactHeading}
                </h3>
                <a
                  href={t.footer.websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto mt-3 block font-bold break-words text-morado-oscuro underline-offset-4 hover:text-coral hover:underline"
                >
                  {t.footer.website}
                </a>
              </div>

              <div className="min-w-0">
                <h3 className={`text-xs font-bold tracking-wide uppercase ${MUTED}`}>
                  {t.footer.followHeading}
                </h3>
                <a
                  href={t.footer.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto mt-3 block font-bold break-words text-morado-oscuro underline-offset-4 hover:text-coral hover:underline"
                >
                  {t.footer.instagram}
                </a>
              </div>
            </div>

            <div className="mt-8 flex min-w-0 flex-1 flex-col flex-wrap items-start justify-end gap-4 border-t border-morado-oscuro/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className={`text-xs ${MUTED}`}>{t.footer.copyright}</p>
              <CTAButton
                surface="light"
                href={BOOKING_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto"
              >
                {t.footer.ctaBook}
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Giant email, clearly separated from the cards above — the
            "tucked behind" overlap read as too cramped even at its smallest
            safe value (any more overlap slices through the glyphs, since
            the button's natural line-height only leaves a few px of
            whitespace above the text at any breakpoint), so real spacing
            wins over the illusion here. */}
        <div className="relative z-0 mt-10 flex min-w-0 justify-center text-center sm:mt-12 md:mt-16">
          <CopyableEmail
            email={t.footer.email}
            copyLabel={t.footer.copyEmail}
            copiedLabel={t.footer.emailCopied}
            ariaLabel={t.footer.copyEmailAriaLabel}
          />
        </div>

        <p className="mt-8 text-center text-sm font-semibold tracking-wide text-morado-oscuro">
          {t.footer.brand}
        </p>
      </div>
    </footer>
  );
}
