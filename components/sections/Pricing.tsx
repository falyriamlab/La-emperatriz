"use client";

import { CTAButton } from "@/components/CTAButton";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PRECIOS, STRIPE_LINKS, sumaMensual } from "@/lib/pricing";

/** Minimal `{token}` substitution — no plural rules needed, see Pricing.tsx callers. */
function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/{(\w+)}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

export function Pricing() {
  const { t } = useLanguage();
  const savingsPercent = Math.round(((sumaMensual - PRECIOS.total) / sumaMensual) * 100);

  return (
    <section id="inversion" className="bg-crema px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold italic text-morado-oscuro sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-lg text-negro/70">
            {t.pricing.subtitle}
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-14 grid gap-8 text-left md:grid-cols-2">
            {/* Pago mensual */}
            <div className="flex flex-col rounded-3xl border border-morado-oscuro/10 bg-white/70 p-10 shadow-sm max-[359px]:p-6">
              <h3 className="text-xl font-bold text-morado-oscuro">
                {t.pricing.monthlyLabel}
              </h3>
              <p className="mt-2 text-base text-negro/70">
                {t.pricing.monthlyDesc}
              </p>

              <div className="mt-8 flex items-end gap-3">
                <span className="text-5xl font-extrabold text-morado-oscuro max-[359px]:text-4xl">
                  {PRECIOS.mensual}€{t.pricing.perMonth}
                </span>
              </div>

              <CTAButton
                surface="light"
                href={STRIPE_LINKS.mensual}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10"
              >
                {t.pricing.ctaMonthly}
              </CTAButton>
            </div>

            {/* Pago único */}
            <div className="relative flex flex-col rounded-3xl border border-morado-oscuro/10 bg-white/70 p-10 shadow-sm max-[359px]:p-6">
              <span className="absolute -top-4 right-6 rounded-full border-2 border-crema bg-amarillo px-4 py-1.5 text-sm font-extrabold text-morado-oscuro shadow-sm">
                {interpolate(t.pricing.savingsBadge, { percent: savingsPercent })}
              </span>
              <h3 className="text-xl font-bold text-morado-oscuro">
                {t.pricing.uniqueLabel}
              </h3>
              <p className="mt-2 text-base text-negro/70">
                {t.pricing.uniqueDesc}
              </p>

              <div className="mt-8 flex items-end gap-3">
                <span
                  className="text-lg text-lila/60 line-through"
                  aria-label={interpolate(t.pricing.monthlyTotalAriaLabel, {
                    precio: `${sumaMensual}€`,
                  })}
                >
                  {sumaMensual}€
                </span>
                <span className="text-5xl font-extrabold text-morado-oscuro max-[359px]:text-4xl">
                  {PRECIOS.total}€
                </span>
              </div>

              <CTAButton
                surface="light"
                href={STRIPE_LINKS.total}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10"
              >
                {t.pricing.ctaUnique}
              </CTAButton>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-sm text-negro/50">
            {t.pricing.includes}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
