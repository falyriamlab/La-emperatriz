const isDev = process.env.NODE_ENV === "development";

/**
 * The landing's contact form only ships once it can actually work: a leads
 * endpoint to send to (NEXT_PUBLIC_LEADS_ENDPOINT, inlined at build time).
 * Until then the section isn't rendered at all — no form that errors on
 * submit. The short privacy notice under the consent checkbox informs in the
 * form itself, so a privacy policy URL (LEGAL.privacy) isn't required. In
 * `next dev` it is always shown so it can be worked on.
 */
export const FORMS_READY = isDev || Boolean(process.env.NEXT_PUBLIC_LEADS_ENDPOINT);
