// Pricing for "La Emperatriz": one fixed price per payment option, no dates.
// The derived amounts (what 4 monthly payments add up to, and the saving)
// are always computed from these constants — never written by hand.

export const PRECIOS = { mensual: 155, total: 555 };

/** Duration of the process — the total is compared against this many monthly payments. */
export const MESES_PROCESO = 4;

// Stripe Payment Links. Keep the amounts above in sync with what Stripe
// actually charges.
export const STRIPE_LINKS = {
  mensual: "https://buy.stripe.com/fZu5kD8yaeDUeus93ydjO0c",
  total: "https://buy.stripe.com/9B6dR98yaanE0DC4NidjO0d",
};

/** What the whole process costs paying month by month (4 × mensual). */
export const sumaMensual = PRECIOS.mensual * MESES_PROCESO;

/** How much paying the total up front saves vs. paying month by month. */
export const ahorro = sumaMensual - PRECIOS.total;
