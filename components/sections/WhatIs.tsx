"use client";

import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function WhatIs() {
  const { t } = useLanguage();

  return (
    <section id="que-es" className="bg-morado-oscuro px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold italic text-crema sm:text-4xl">
            {t.whatIs.title}
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-2xl leading-snug font-semibold text-crema sm:text-3xl">
            {t.whatIs.paragraph1}
          </p>
        </Reveal>

        <Reveal>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-crema/70">
            {t.whatIs.paragraph2}
          </p>

          <div className="mt-16 flex flex-col items-center gap-10 sm:flex-row sm:items-stretch sm:justify-center sm:gap-0 sm:divide-x sm:divide-crema/20">
            {t.whatIs.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex flex-col items-center gap-2 px-10 text-center"
              >
                <span className="text-2xl font-extrabold text-amarillo">
                  {pillar.title}
                </span>
                <p className="max-w-[14rem] text-sm text-crema/70">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
