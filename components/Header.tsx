"use client";

import Image from "next/image";
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
          src="/logo/logo-horizontal-morado.svg"
          alt={t.header.logoAlt}
          width={666}
          height={102}
          className="h-5 w-auto sm:h-6"
        />

        <div className="flex items-center">
          {(["es", "pt"] as const).map((lang, i) => (
            <span key={lang} className="flex items-center">
              {i > 0 && (
                <span aria-hidden className="text-sm text-negro/30">
                  ·
                </span>
              )}
              <button
                type="button"
                onClick={() => setLanguage(lang)}
                aria-label={ARIA_LABELS[lang]}
                aria-current={language === lang ? "true" : undefined}
                className={`flex min-h-11 min-w-11 items-center justify-center text-sm font-bold transition-colors ${
                  language === lang
                    ? "text-morado-oscuro"
                    : "text-negro/35 hover:text-negro/60"
                }`}
              >
                {t.languageToggle[lang]}
              </button>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
