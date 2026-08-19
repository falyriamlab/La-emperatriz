"use client";

import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="preguntas"
      className="relative overflow-hidden bg-crema px-6 py-20 sm:py-28"
    >
      <DecorativeSvg
        src="/elements/star-ellipse-morado.svg"
        width={500}
        height={587}
        className="absolute top-6 left-1/2 -translate-x-1/2 opacity-[0.12]"
        imgClassName="h-24 w-auto"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
            {t.faq.title}
          </h2>
        </Reveal>

        <Reveal className="mt-14">
          {t.faq.items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="border-b border-morado-oscuro/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-bold text-morado-oscuro">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className={`flex h-7 w-7 flex-none items-center justify-center text-coral motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    <MdAdd className="h-5 w-5" />
                  </span>
                </button>
                <div
                  className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`pb-6 text-base leading-relaxed text-negro/70 motion-safe:transition-opacity motion-safe:duration-300 ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
