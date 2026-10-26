"use client";

import Image from "next/image";
import { BASE_PATH } from "@/lib/basePath";
import { useLanguage, type Language } from "@/lib/i18n/LanguageContext";

// Fixed per-button labels: each one names the action in the language it
// switches *to*, independent of which language is currently active.
const ARIA_LABELS: Record<Language, string> = {
  es: "Cambiar a español",
  pt: "Mudar para português",
};

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-morado-oscuro/10 bg-crema/85 px-6 backdrop-blur">
      {/* First focusable element on the page. Visually hidden until it gets
          keyboard focus; jumps past the header to <main id="contenido">. */}
      <a
        href="#contenido"
        // Move focus into <main> so the next Tab continues from there in
        // every browser. tabindex is added only for this jump and removed
        // as soon as focus leaves, so clicks elsewhere never focus <main>.
        onClick={() => {
          const main = document.getElementById("contenido");
          if (!main) return;
          main.setAttribute("tabindex", "-1");
          main.focus();
          main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
        }}
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[60] focus-visible:inline-flex focus-visible:min-h-11 focus-visible:items-center focus-visible:rounded-xl focus-visible:bg-morado-oscuro focus-visible:px-5 focus-visible:text-sm focus-visible:font-bold focus-visible:text-crema focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-morado-oscuro"
      >
        {t.header.skipToContent}
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between py-2">
        <Image
          src={`${BASE_PATH}/logo/logo-horizontal-morado.svg`}
          alt={t.header.logoAlt}
          width={666}
          height={102}
          className="h-5 w-auto sm:h-6"
        />

        {/* Pill switch: the thumb is a purely decorative absolutely-positioned
            layer sliding under the buttons — the buttons themselves stay
            real, independent <button>s (aria-label + aria-current untouched)
            so screen readers/keyboard nav see the same semantics as before,
            just a different skin. motion-safe on the thumb's transition
            only: under prefers-reduced-motion it still jumps straight to
            the active side, no slide. */}
        <div
          role="group"
          aria-label={t.header.languageLabel}
          className="relative inline-flex items-center rounded-full bg-morado-oscuro/10 p-1"
        >
          <span
            aria-hidden="true"
            className={`absolute inset-y-1 left-1 h-11 w-11 rounded-full bg-morado-oscuro motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out ${
              language === "pt" ? "translate-x-11" : "translate-x-0"
            }`}
          />
          {(["es", "pt"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              aria-label={ARIA_LABELS[lang]}
              aria-current={language === lang ? "true" : undefined}
              className={`relative z-10 flex min-h-11 min-w-11 items-center justify-center text-sm font-bold transition-colors ${
                language === lang
                  ? "text-crema"
                  : "text-negro/40 hover:text-negro/60"
              }`}
            >
              {t.languageToggle[lang]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
