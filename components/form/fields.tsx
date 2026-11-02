import type { ReactNode } from "react";
import { MdErrorOutline } from "react-icons/md";

// Shared look and validation rules for the site's forms (ContactForm on the
// landing, MasterclassForm on /masterclass). The Apps Script receiver
// (integrations/apps-script/Code.gs) copies EMAIL_RE and the phone rule:
// change them there too.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^[+\d\s\-()]+$/;

/** Only +, digits, spaces, dashes and parentheses, with 7–15 digits. */
export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "").length;
  return PHONE_CHARS_RE.test(value) && digits >= 7 && digits <= 15;
}

export const LABEL_CLASS = "block text-sm font-bold text-morado-oscuro";
export const HINT_CLASS = "mt-2 text-sm text-negro/70";
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-morado-oscuro";

/** `muted`: placeholder-colored text, for a select still on its empty option. */
export function textInputClass(invalid: boolean, muted = false) {
  return `block min-h-12 w-full rounded-xl border-[1.5px] bg-white px-4 py-3 text-base ${muted ? "text-negro/65" : "text-negro"} placeholder:text-negro/65 focus:outline-2 focus:outline-offset-2 focus:outline-morado-oscuro ${
    invalid ? "border-error" : "border-lila"
  }`;
}

/** Ids joined for aria-describedby, skipping the ones not rendered. */
export function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

export function ErrorMessage({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-error">
      <MdErrorOutline aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
      <span>{children}</span>
    </p>
  );
}
