"use client";

import { useEffect, useState } from "react";
import { CTAButton } from "@/components/CTAButton";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  getPricingActual,
  PRECIO_LANZAMIENTO,
  PRECIO_REGULAR,
  STRIPE_LINKS,
  type PricingInfo,
} from "@/lib/pricing";

const CUPOS_DISPONIBLES = 6;
const CUPOS_TOTALES = 10;

/** Minimal `{token}` substitution — no plural rules needed, see Pricing.tsx callers. */
function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/{(\w+)}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

// This page is statically prerendered at build time (see lib/pricing.ts),
// so the initial render — both the server-rendered HTML and React's first
// client pass during hydration — must never depend on `new Date()`, or
// visitors would see whatever date the site happened to be built on,
// frozen forever. This default is a plain constant (launch pricing, no
// days-remaining count yet) so that first render is always identical on
// server and client. The real, date-correct pricing is only computed
// inside the effect below, which runs client-side after mount — i.e.
// resolved against the visitor's actual clock, not build time.
const DEFAULT_PRICING: PricingInfo = {
  ...PRECIO_LANZAMIENTO,
  esLanzamiento: true,
  diasRestantes: null,
};

export function Pricing() {
  const { t } = useLanguage();
  const [pricing, setPricing] = useState<PricingInfo>(DEFAULT_PRICING);

  useEffect(() => {
    // Deliberately NOT computed via useState's lazy initializer: that
    // function still runs during the server prerender pass for a "use
    // client" component, so `new Date()` there would evaluate to build
    // time, not the visitor's real clock — the exact bug this effect
    // exists to avoid. It has to happen here, after mount, client-only.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPricing(getPricingActual());
  }, []);

  const linkMensual = pricing.esLanzamiento
    ? STRIPE_LINKS.lanzamientoMensual
    : STRIPE_LINKS.regularMensual;
  const linkUnico = pricing.esLanzamiento
    ? STRIPE_LINKS.lanzamientoUnico
    : STRIPE_LINKS.regularUnico;

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
          {/* Two separate urgency signals — cupos and precio — kept as
              distinct badges rather than merged into one sentence. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-4 py-2 text-sm font-semibold text-coral">
              <span className="h-2 w-2 rounded-full bg-coral" aria-hidden />
              {interpolate(t.pricing.cuposBadge, {
                disponibles: CUPOS_DISPONIBLES,
                total: CUPOS_TOTALES,
              })}
            </div>

            {pricing.esLanzamiento && (
              <div className="inline-flex items-center gap-2 rounded-full border border-amarillo/40 bg-amarillo/15 px-4 py-2 text-sm font-semibold text-morado-oscuro">
                <span className="h-2 w-2 rounded-full bg-amarillo" aria-hidden />
                {t.pricing.launchBadge}
                {pricing.diasRestantes !== null && (
                  <span className="text-morado-oscuro/70">
                    {" "}
                    {interpolate(t.pricing.diasBadge, {
                      dias: pricing.diasRestantes,
                    })}
                    .
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-14 grid gap-8 text-left md:grid-cols-2">
            {/* Pago mensual */}
            <div className="flex flex-col rounded-3xl border border-morado-oscuro/10 bg-white/70 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-morado-oscuro">
                {t.pricing.monthlyLabel}
              </h3>
              <p className="mt-2 text-base text-negro/70">
                {t.pricing.monthlyDesc}
              </p>

              <div className="mt-8 flex items-end gap-3">
                {pricing.esLanzamiento && (
                  <span
                    className="text-lg text-lila/60 line-through"
                    aria-label={interpolate(t.pricing.regularPriceAriaLabel, {
                      precio: `${PRECIO_REGULAR.mensual}€`,
                    })}
                  >
                    {PRECIO_REGULAR.mensual}€
                  </span>
                )}
                <span className="text-5xl font-extrabold text-morado-oscuro">
                  {pricing.mensual}€/mes
                </span>
              </div>

              <CTAButton
                surface="light"
                href={linkMensual}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10"
              >
                {t.pricing.ctaMonthly}
              </CTAButton>
            </div>

            {/* Pago único */}
            <div className="relative flex flex-col rounded-3xl border border-morado-oscuro/10 bg-white/70 p-10 shadow-sm">
              <span className="absolute -top-3 right-8 rounded-full bg-amarillo px-3 py-1 text-xs font-bold text-morado-oscuro">
                {t.pricing.uniqueBadge}
              </span>
              <h3 className="text-xl font-bold text-morado-oscuro">
                {t.pricing.uniqueLabel}
              </h3>
              <p className="mt-2 text-base text-negro/70">
                {t.pricing.uniqueDesc}
              </p>

              <div className="mt-8 flex items-end gap-3">
                {pricing.esLanzamiento && (
                  <span
                    className="text-lg text-lila/60 line-through"
                    aria-label={interpolate(t.pricing.regularPriceAriaLabel, {
                      precio: `${PRECIO_REGULAR.unico}€`,
                    })}
                  >
                    {PRECIO_REGULAR.unico}€
                  </span>
                )}
                <span className="text-5xl font-extrabold text-morado-oscuro">
                  {pricing.unico}€
                </span>
              </div>

              <CTAButton
                surface="light"
                href={linkUnico}
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
