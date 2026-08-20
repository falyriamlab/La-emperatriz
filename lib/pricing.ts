// Centralized pricing + launch-window logic for "La Emperatriz".
//
// This module is framework-agnostic (no "use client") so it can be imported
// from anywhere, but the actual date comparison must only ever run
// client-side — see components/sections/Pricing.tsx for why.

/** Human-readable cutoff date, for display copy ("desde el 11 de septiembre..."). */
export const FECHA_CAMBIO_PRECIO = "2026-09-11"; // lunes, hora local España

/**
 * Precise UTC instant for "2026-09-11T00:00:00" in Europe/Madrid time.
 * Spain is on CEST (UTC+2) in September (DST ends late October), so
 * 2026-09-11 00:00 Madrid = 2026-09-10 22:00 UTC.
 *
 * We anchor to this exact instant — not `new Date(FECHA_CAMBIO_PRECIO)` —
 * because that string, parsed with no timezone, resolves to *the
 * visitor's local midnight*, not Spain's. A visitor several timezones
 * away from Madrid would then see the price change at the wrong moment
 * for them. The launch window is a business decision anchored to Puente's
 * own timezone, so every visitor worldwide should flip at the same
 * instant, computed from Madrid's clock.
 */
const FECHA_CAMBIO_PRECIO_UTC = "2026-09-10T22:00:00Z";

export const PRECIO_LANZAMIENTO = { mensual: 88, unico: 340 };
export const PRECIO_REGULAR = { mensual: 150, unico: 555 };

// Each link is tied to a Stripe price that updates on Stripe's side when
// the launch window ends — same link for lanzamiento/regular within a
// payment type, but mensual and único are separate links (one per type).
const STRIPE_MENSUAL = "https://buy.stripe.com/00wfZhbKm67ogCA7ZudjO06";
const STRIPE_UNICO = "https://buy.stripe.com/dRmdR9eWy9jAgCA2FadjO07";

export const STRIPE_LINKS = {
  lanzamientoMensual: STRIPE_MENSUAL,
  lanzamientoUnico: STRIPE_UNICO,
  regularMensual: STRIPE_MENSUAL,
  regularUnico: STRIPE_UNICO,
};

export type PricingInfo = {
  mensual: number;
  unico: number;
  esLanzamiento: boolean;
  /** Días completos que quedan de precio de lanzamiento, o null si ya no aplica. */
  diasRestantes: number | null;
};

/**
 * Resolves today's actual pricing. Pass `now` explicitly in tests; in the
 * app, always call this client-side (e.g. inside a useEffect) — this page
 * is statically prerendered at build time, so if this ran during the
 * server render, `now` would be frozen at build time forever, not the
 * visitor's real date.
 */
export function getPricingActual(now: Date = new Date()): PricingInfo {
  const cambio = new Date(FECHA_CAMBIO_PRECIO_UTC);
  const esLanzamiento = now.getTime() < cambio.getTime();
  const precios = esLanzamiento ? PRECIO_LANZAMIENTO : PRECIO_REGULAR;
  const diasRestantes = esLanzamiento
    ? Math.max(
        0,
        Math.ceil((cambio.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      )
    : null;

  return { ...precios, esLanzamiento, diasRestantes };
}
