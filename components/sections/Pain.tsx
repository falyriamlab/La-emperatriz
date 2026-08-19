"use client";

import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const icons = [
  <div key={0} className="flex flex-col items-center gap-1.5" aria-hidden>
    <span className="h-1.5 w-8 rounded-full bg-morado-oscuro" />
    <span className="h-1.5 w-5 rounded-full bg-morado-oscuro/50" />
  </div>,
  <div key={1} className="relative h-8 w-8" aria-hidden>
    <span className="absolute top-0 left-0 h-6 w-6 rounded-full border-2 border-morado-oscuro" />
    <span className="absolute right-0 bottom-0 h-4 w-4 rounded-full bg-coral" />
  </div>,
  <div key={2} className="flex items-center gap-2" aria-hidden>
    <span className="h-3 w-3 rounded-full bg-morado-oscuro" />
    <span className="h-0.5 w-6 bg-morado-oscuro/30" />
    <span className="h-3 w-3 bg-coral" />
  </div>,
];

export function Pain() {
  const { t } = useLanguage();

  return (
    <section
      id="dolor"
      className="border-t border-morado-oscuro/10 bg-lila/10 px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
            {t.pain.title}
          </h2>
        </Reveal>

        <Reveal>
          <div className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
            {t.pain.items.map((text, i) => (
              <div
                key={text}
                className="flex flex-col items-center gap-5 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/60">
                  {icons[i]}
                </div>
                <p className="text-base leading-relaxed text-negro/75">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            <DecorativeSvg
              src="/elements/espiral-star.svg"
              width={486}
              height={574}
              className="relative shrink-0 opacity-70"
              imgClassName="h-9 w-auto sm:h-11"
            />
            <p className="text-center text-2xl font-bold text-coral italic sm:text-3xl">
              {t.pain.closing}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
