"use client";

import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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
                className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-morado-oscuro/10 bg-white/70 p-8 text-left shadow-sm motion-safe:transition-[transform,box-shadow] motion-safe:duration-[250ms] motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
              >
                <span className="text-4xl font-extrabold text-amarillo">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-morado-oscuro">
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed text-negro/70">
                  {step.desc}
                </p>

                {/* Bottom accent line — thickens + recolors on hover. State
                    change (height/color) is unconditional so it still fires
                    under reduced motion; only the transition is motion-safe. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-morado-oscuro/15 group-hover:h-1 group-hover:bg-coral motion-safe:transition-[height,background-color] motion-safe:duration-[250ms] motion-safe:ease-out"
                />
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-xl text-sm text-negro/50">
            {t.howItWorks.extras}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
