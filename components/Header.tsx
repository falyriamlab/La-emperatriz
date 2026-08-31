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
        <div className="relative inline-flex items-center rounded-full bg-morado-oscuro/10 p-1">
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
