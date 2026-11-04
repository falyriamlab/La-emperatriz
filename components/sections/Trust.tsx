"use client";

import { CountUp } from "@/components/CountUp";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { RotatingWords } from "@/components/RotatingWords";
import { Testimonials } from "@/components/sections/Testimonials";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const VALUE_CLASS = "font-extrabold text-amarillo text-5xl sm:text-6xl";
// The rotating word ("Artes visuales" is the longest) never wraps (see
// RotatingWords.tsx), so it needs its own, smaller responsive scale — at
// VALUE_CLASS's size it would overflow the 3-column grid's cells well
// past the column's own width. Sized to fit "Artes visuales"/"Artes
// visuais" at every breakpoint from md (where the grid goes 3-column)
// up, verified against the actual rendered column widths.
const ROTATING_VALUE_CLASS =
  "font-extrabold text-amarillo text-4xl sm:text-5xl md:text-3xl lg:text-4xl";

export function Trust() {
  const { t } = useLanguage();

  return (
    <section
      id="confianza"
      className="relative overflow-hidden bg-morado-oscuro py-20 sm:py-28"
    >
      {/* Horizontal padding lives here (not on <section>) so the
          testimonials carousel below can run edge to edge. The hand is
          scoped to this block too, so it stays centered on the stats as
          before instead of drifting down behind the cards. */}
      <div className="relative px-6">
        <DecorativeSvg
          src="/elements/hand.svg"
          width={538}
          height={875}
          className="absolute top-1/2 -right-16 hidden -translate-y-1/2 opacity-[0.14] md:block"
          // Smaller on tablet: at md the stats block is short enough that
          // the full-size hand reached down into the testimonials title.
          imgClassName="h-[28rem] w-auto lg:h-[34rem]"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold italic text-crema sm:text-4xl">
              {t.trust.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-crema/70">
              {t.trust.intro}
            </p>
          </Reveal>
  
          <Reveal>
            <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
              {t.trust.stats.map((stat, i) => {
                const isNumeric = /^\d+$/.test(stat.value);
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-3"
                  >
                    {/* Fixed-height slot: the rotating word runs a smaller
                        font than the numeric stats (see ROTATING_VALUE_CLASS
                        above), so without this the three stats' labels would
                        sit at different heights in the 3-column row. */}
                    <div className="flex h-12 items-center justify-center sm:h-[3.75rem]">
                      {isNumeric ? (
                        <CountUp
                          end={parseInt(stat.value, 10)}
                          suffix={"suffix" in stat ? stat.suffix : undefined}
                          delayMs={i * 150}
                          className={VALUE_CLASS}
                        />
                      ) : (
                        <RotatingWords
                          words={stat.value.split(", ")}
                          intervalMs={3500}
                          className={ROTATING_VALUE_CLASS}
                        />
                      )}
                    </div>
                    <p className="max-w-[16rem] text-sm text-crema/70">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Recognition: plain text, no logos. crema/80 keeps AA (≈5:1) on morado. */}
            <p className="mx-auto mt-12 max-w-xl text-sm text-crema/80">
              {t.trust.recognition}
            </p>
          </Reveal>
        </div>
      </div>

      <Testimonials />
    </section>
  );
}
