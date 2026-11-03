import { LEGAL } from "@/lib/legal";

const isDev = process.env.NODE_ENV === "development";

/**
 * The landing's contact form only ships once it can actually work and is
 * legally covered: a leads endpoint to send to (NEXT_PUBLIC_LEADS_ENDPOINT,
 * inlined at build time) AND a privacy policy to link from the consent
 * (LEGAL.privacy). Until then the section isn't rendered at all — no form
 * that errors on submit or collects data without a policy. In `next dev`
 * it is always shown so it can be worked on.
 */
export const FORMS_READY =
  isDev || (Boolean(process.env.NEXT_PUBLIC_LEADS_ENDPOINT) && Boolean(LEGAL.privacy));
