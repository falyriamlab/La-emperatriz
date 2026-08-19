"use client";

import { MdCheck, MdRemove } from "react-icons/md";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function WhoFor() {
  const { t } = useLanguage();

  return (
    <section id="para-quien" className="bg-crema px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <DecorativeSvg
              src="/elements/star.svg"
              width={387}
              height={349}
              className="relative shrink-0 opacity-80"
              imgClassName="h-8 w-auto"
            />
            <h2 className="text-center text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
              {t.whoFor.title}
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-lg font-bold text-morado-oscuro">
                {t.whoFor.yesTitle}
              </h3>
              <ul className="mt-6 flex flex-col gap-4">
                {t.whoFor.yesItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amarillo/25 text-coral"
                    >
                      <MdCheck className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-base leading-relaxed text-negro/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-morado-oscuro">
                {t.whoFor.noTitle}
              </h3>
              <ul className="mt-6 flex flex-col gap-4">
                {t.whoFor.noItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center text-lila/70"
                    >
                      <MdRemove className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-base leading-relaxed text-negro/55">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
