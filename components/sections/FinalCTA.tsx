"use client";

import { CTAButton } from "@/components/CTAButton";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { BOOKING_LINK } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section
      id="cta-final"
      className="relative overflow-hidden rounded-b-[2rem] bg-morado-oscuro px-6 py-24 sm:rounded-b-[3rem] sm:py-32 lg:rounded-b-[4rem]"
    >
      <DecorativeSvg
        src="/elements/galaxy.svg"
        width={735}
        height={515}
        className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
        imgClassName="h-auto w-[1800px] max-w-none"
      />
      <DecorativeSvg
        src="/elements/stamp.svg"
        width={447}
        height={447}
        className="absolute top-10 right-10 z-10 hidden opacity-90 sm:block"
        imgClassName="h-28 w-auto sm:h-32"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="text-base font-extrabold tracking-[0.22em] text-amarillo">
          {t.finalCta.eyebrow}
        </span>

        <h2 className="font-display mt-6 text-4xl leading-[1.1] font-semibold italic text-crema sm:text-5xl">
          {t.finalCta.title}
        </h2>
        <p className="mt-6 text-lg text-crema/80">{t.finalCta.paragraph}</p>

        <CTAButton
          surface="dark"
          href={BOOKING_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10"
        >
          {t.finalCta.cta}
        </CTAButton>

        <p className="mt-4 text-sm text-crema/75">{t.finalCta.note}</p>

        <p className="mt-8 text-sm font-semibold tracking-wide text-crema/75">
          {t.finalCta.brand}
        </p>
      </div>
    </section>
  );
}
