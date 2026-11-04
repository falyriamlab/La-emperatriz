"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CTAButton } from "@/components/CTAButton";
import { LanguageToggle } from "@/components/LanguageToggle";
import { BASE_PATH } from "@/lib/basePath";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type HeaderProps = {
  /** "Comenzar mi proceso" button. Off on pages without the landing's Hero and pricing (/masterclass). */
  showCta?: boolean;
};

export function Header({ showCta = true }: HeaderProps) {
  const { t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  // The header CTA only shows once the Hero (with its own identical CTA) has
  // scrolled away, so the first screen never has two "Comenzar" buttons.
  // Starts "visible" on the server and the first client render alike, so
  // hydration matches.
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    if (!showCta) return;
    const hero = document.getElementById("hero");
    const header = headerRef.current;
    if (!hero || !header) return;
    // The Hero counts as gone once its bottom passes under the sticky header.
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [showCta]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-morado-oscuro/10 bg-crema/85 px-6 backdrop-blur max-[359px]:px-4"
    >
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

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hidden only via the js: variant (globals.css): without JS, or if
              the page never hydrates (no-hydrate), it is always shown. The
              hidden state is invisible (not just transparent) so it's out of
              the Tab order and the accessibility tree. The fade is
              motion-safe only. Below sm only the arrow shows; the label
              stays in the DOM as the link's accessible name. */}
          {showCta && (
            <div
              className={`motion-safe:transition-[opacity,visibility] motion-safe:duration-300 motion-safe:ease-out ${
                heroVisible ? "js:invisible js:opacity-0" : ""
              }`}
            >
              <CTAButton href="#inversion" surface="light" size="compact">
                <span className="sr-only sm:not-sr-only">{t.header.cta}</span>
              </CTAButton>
            </div>
          )}

          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
