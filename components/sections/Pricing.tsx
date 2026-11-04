"use client";

import type { ReactNode } from "react";
import { CTAButton } from "@/components/CTAButton";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LEGAL } from "@/lib/legal";
import { ContactModalButton } from "@/components/ContactModal";
import { BOOKING_LINK } from "@/lib/links";
import { PRECIOS, STRIPE_LINKS, ahorro, sumaMensual } from "@/lib/pricing";

// Prices are fixed constants (no dates), so the server-rendered HTML already
// shows the real amounts — nothing here waits for the client.

/** Minimal `{token}` substitution — no plural rules needed. */
function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/{(\w+)}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

/** "155 €" with a non-breaking space so the amount never wraps from its sign. */
function euros(amount: number) {
  return `${amount} €`;
}

/**
 * "{amount} € pagando mes a mes" → only "620 €" struck through; the words
 * stay readable, so the struck figure reads as "what paying monthly would
 * cost", never as an old price.
 */
function comparedLine(template: string): ReactNode {
  const match = template.match(/^(.*?)\{amount\}(\s*€)?(.*)$/);
  if (!match) return template;
  const [, before, sign, after] = match;
  return (
    <>
      {before}
      <s className="decoration-2">{sign ? euros(sumaMensual) : sumaMensual}</s>
      {after}
    </>
  );
}

const CARD_CLASS =
  "flex flex-col rounded-3xl border border-morado-oscuro/10 bg-white/70 p-10 shadow-sm max-[359px]:p-6";
const PRICE_CLASS =
  "text-5xl font-extrabold text-morado-oscuro max-[359px]:text-4xl";

export function Pricing() {
  const { t } = useLanguage();
  const p = t.pricing;

  return (
    <section id="inversion" className="bg-crema px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold italic text-morado-oscuro sm:text-4xl">
            {p.title}
          </h2>
          <p className="mt-4 text-lg text-negro/70">{p.subtitle}</p>
        </Reveal>

        <Reveal>
          {/* Same card structure and weight; the button sits at the bottom
              (mt-auto) so both line up whatever the content above. */}
          <div className="mt-14 grid gap-8 text-left md:grid-cols-2">
            {/* Inversión mensual */}
            <div className={CARD_CLASS}>
              <h3 className="text-xl font-bold text-morado-oscuro">{p.monthlyLabel}</h3>
              <p className="mt-2 text-base text-negro/70">{p.monthlyDesc}</p>

              <p className={`mt-8 ${PRICE_CLASS}`}>
                {euros(PRECIOS.mensual)}
                {p.perMonth}
              </p>

              <div className="mt-auto pt-10">
                <CTAButton
                  surface="light"
                  href={STRIPE_LINKS.mensual}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.ctaMonthly}
                </CTAButton>
              </div>
            </div>

            {/* Inversión total */}
            <div className={CARD_CLASS}>
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <h3 className="text-xl font-bold text-morado-oscuro">{p.uniqueLabel}</h3>
                {/* Inside the card's border; morado on amarillo = 4.65:1. */}
                <span className="rounded-full bg-amarillo px-3 py-1 text-sm font-extrabold text-morado-oscuro">
                  {interpolate(p.savingsBadge, { amount: ahorro })}
                </span>
              </div>
              <p className="mt-2 text-base text-negro/70">{p.uniqueDesc}</p>

              <p className={`mt-8 ${PRICE_CLASS}`}>{euros(PRECIOS.total)}</p>
              <p className="mt-2 text-base text-negro/70">{comparedLine(p.comparedLabel)}</p>

              <div className="mt-auto pt-10">
                <CTAButton
                  surface="light"
                  href={STRIPE_LINKS.total}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.ctaUnique}
                </CTAButton>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-sm text-negro/50">{p.includes}</p>

          {/* Secondary paths for the undecided: plain text links, clearly
              below the two payment buttons in the hierarchy. Same booking
              URL as FinalCTA (lib/links.ts); the contact form opens in a
              modal (only with FORMS_READY). */}
          <div className="mt-6 flex flex-col items-center gap-1">
            <a
              href={BOOKING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-base font-semibold text-morado-oscuro underline decoration-morado-oscuro/40 underline-offset-4 hover:text-coral hover:decoration-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-morado-oscuro"
            >
              {p.doubtsLink}
            </a>
            <ContactModalButton surface="light" />
          </div>

          {/* Only once there's a purchase-terms page (lib/legal.ts). */}
          {LEGAL.terms && (
            <p className="mx-auto mt-2 max-w-xl text-sm text-negro/70">
              {p.termsNoteBefore}
              <a
                href={LEGAL.terms}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-morado-oscuro underline underline-offset-2 hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-morado-oscuro"
              >
                {p.termsLinkLabel}
              </a>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
