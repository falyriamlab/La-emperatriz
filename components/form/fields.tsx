import type { ReactNode } from "react";
import { MdErrorOutline, MdExpandMore } from "react-icons/md";

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

/**
 * Layered privacy information under the consent checkbox, aligned with its
 * text (h-5 box + gap-3): a short line that is always visible (point the
 * checkbox's aria-describedby at `summaryId`) and the full notice in a
 * native <details>, closed by default — it opens without JavaScript and
 * screen readers announce its expanded/collapsed state.
 */
export function PrivacyInfo({
  summaryId,
  summary,
  more,
  notice,
}: {
  summaryId: string;
  summary: string;
  more: string;
  notice: string;
}) {
  return (
    <div className="mt-2 pl-8 text-sm leading-relaxed text-negro/70">
      <p id={summaryId}>{summary}</p>
      <details className="group">
        <summary
          className={`inline-flex min-h-11 cursor-pointer list-none items-center gap-1 rounded font-semibold text-morado-oscuro underline decoration-morado-oscuro/40 underline-offset-2 hover:decoration-current [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
        >
          {more}
          <MdExpandMore
            aria-hidden="true"
            className="h-5 w-5 flex-none group-open:rotate-180 motion-safe:transition-transform motion-safe:duration-200"
          />
        </summary>
        <p className="pb-1">{notice}</p>
      </details>
    </div>
  );
}
