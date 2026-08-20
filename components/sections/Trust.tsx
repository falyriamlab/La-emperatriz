"use client";

import { CountUp } from "@/components/CountUp";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { RotatingWords } from "@/components/RotatingWords";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const VALUE_CLASS = "font-extrabold text-amarillo text-5xl sm:text-6xl";

export function Trust() {
  const { t } = useLanguage();

  return (
    <section
      id="confianza"
      className="relative overflow-hidden bg-morado-oscuro px-6 py-20 sm:py-28"
    >
      <DecorativeSvg
        src="/elements/hand.svg"
        width={538}
        height={875}
        className="absolute top-1/2 -right-16 hidden -translate-y-1/2 opacity-[0.14] md:block"
        imgClassName="h-[34rem] w-auto"
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
          <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
            {t.trust.stats.map((stat, i) => {
              const isNumeric = /^\d+$/.test(stat.value);
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-3"
                >
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
                      className={VALUE_CLASS}
                    />
                  )}
                  <p className="max-w-[16rem] text-sm text-crema/70">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
