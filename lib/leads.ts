// Lead capture transport. The site is a static export (GitHub Pages), so
// there are no API routes or server actions: the browser POSTs straight to
// a third-party endpoint. This file is the ONLY place that knows about the
// destination — swap the request shape here when the final provider is
// chosen; components/sections/ContactForm.tsx just calls submitLead().
//
// NEXT_PUBLIC_LEADS_ENDPOINT is inlined at build time (static export), so
// it must be set in the build environment (see .github/workflows/deploy.yml).

import type { Language } from "@/lib/i18n/LanguageContext";

export type ProjectTypeKey =
  | "escenicas"
  | "musica"
  | "visuales"
  | "interdisciplinar"
  | "otro";

// PROVISIONAL ranges, pending confirmation with Daniela. The key is what's
// sent; the visible label always comes from the dictionary.
export type BudgetKey = "lt100" | "r100_150" | "r150_250" | "gt250";

export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  projectType: ProjectTypeKey | "";
  budget: BudgetKey | "";
  language: Language;
  consent: true;
  consentAt: string;
  pageUrl: string;
  submittedAt: string;
};

export type SubmitLeadResult = { ok: true } | { ok: false };

const ENDPOINT = process.env.NEXT_PUBLIC_LEADS_ENDPOINT;
const TIMEOUT_MS = 10_000;
const DEV_FAKE_DELAY_MS = 800;

export async function submitLead(
  payload: LeadPayload,
): Promise<SubmitLeadResult> {
  if (!ENDPOINT) {
    if (process.env.NODE_ENV === "development") {
      // Lets the success state be exercised locally without a backend.
      console.info("[leads] NEXT_PUBLIC_LEADS_ENDPOINT not set — dev payload:", payload);
      await new Promise((resolve) => setTimeout(resolve, DEV_FAKE_DELAY_MS));
      return { ok: true };
    }
    // Never fake success in production: the lead would be silently lost.
    console.error("[leads] NEXT_PUBLIC_LEADS_ENDPOINT is not configured; lead not sent.");
    return { ok: false };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Google Apps Script Web App: it doesn't answer CORS preflights, so the
    // request must stay "simple" — text/plain body (still JSON inside, the
    // script parses e.postData.contents) and no custom headers. Apps Script
    // replies via a 302 to googleusercontent.com, hence redirect: "follow".
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`[leads] Endpoint responded ${res.status}.`);
      return { ok: false };
    }
    // A 200 alone isn't enough: the script reports its own outcome.
    const data: unknown = await res.json();
    if (typeof data !== "object" || data === null || (data as { ok?: unknown }).ok !== true) {
      console.error("[leads] Endpoint did not confirm the lead:", data);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    console.error("[leads] Request failed:", error);
    return { ok: false };
  } finally {
    clearTimeout(timeout);
  }
}
