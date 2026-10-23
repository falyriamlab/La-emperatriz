"use client";

import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Shared by the 3 step cards and the wide "purpose" card so they stay one
// visual family: same surface, border, lift-on-hover and accent line.
const CARD_CLASS =
  "group relative overflow-hidden rounded-2xl border border-morado-oscuro/10 bg-white/70 p-8 text-left shadow-sm motion-safe:transition-[transform,box-shadow] motion-safe:duration-[250ms] motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md";
const NUMBER_CLASS = "text-4xl font-extrabold text-amarillo";
const TITLE_CLASS = "text-xl font-bold text-morado-oscuro";

/* Bottom accent line — thickens + recolors on hover. State change
   (height/color) is unconditional so it still fires under reduced motion;
   only the transition is motion-safe. */
function AccentLine() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-0.5 bg-morado-oscuro/15 group-hover:h-1 group-hover:bg-coral motion-safe:transition-[height,background-color] motion-safe:duration-[250ms] motion-safe:ease-out"
    />
  );
}

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-crema px-6 py-20 sm:py-28"
    >
      <DecorativeSvg
        src="/elements/protons-morado.svg"
        width={500}
        height={561}
        className="absolute top-8 -right-10 hidden opacity-[0.15] sm:block"
        imgClassName="h-40 w-auto"
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-negro/70">
            {t.howItWorks.subtitle}
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {t.howItWorks.steps.map((step) => (
              <div
                key={step.number}
                className={`${CARD_CLASS} flex flex-col items-start gap-3`}
              >
                <span className={NUMBER_CLASS}>{step.number}</span>
                <h3 className={TITLE_CLASS}>{step.title}</h3>
                <p className="text-base leading-relaxed text-negro/70">
                  {step.desc}
                </p>
                <AccentLine />
              </div>
            ))}

            {/* Purpose: full-width row under the 3 steps, not a 4th column.
                Number + title on the left, paragraph at reading width on the
                right from md up; stacked on mobile. Its own Reveal, slightly
                delayed, so it lands after the row above. */}
            <Reveal delay={150} className="col-span-full">
              <div
                className={`${CARD_CLASS} flex flex-col gap-3 md:flex-row md:items-start md:gap-12`}
              >
                <div className="flex flex-col items-start gap-3 md:w-48 md:flex-none">
                  <span className={NUMBER_CLASS}>
                    {t.howItWorks.purpose.number}
                  </span>
                  <h3 className={TITLE_CLASS}>{t.howItWorks.purpose.title}</h3>
                </div>
                <p className="max-w-prose text-base leading-[1.8] text-negro/70">
                  {t.howItWorks.purpose.desc}
                </p>
                <AccentLine />
              </div>
            </Reveal>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-sm text-negro/50">
            {t.howItWorks.extras}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
