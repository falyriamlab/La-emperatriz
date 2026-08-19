"use client";

import { CTAButton } from "@/components/CTAButton";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  // The brand name ("La Emperatriz" / "A Imperatriz") is always the title's
  // first two words in both dictionaries — split here so it can carry the
  // display/italic accent while the rest of the sentence stays bold sans,
  // without touching the dictionary's title string itself.
  const words = t.hero.title.trim().split(/\s+/);
  const accent = words.slice(0, 2).join(" ");
  const rest = words.slice(2).join(" ");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-morado-oscuro px-6 py-16"
    >
      <DecorativeSvg
        src="/elements/stamp.svg"
        width={447}
        height={447}
        className="absolute -top-48 -right-48 z-0 hidden opacity-[0.15] sm:block lg:-top-64 lg:-right-64"
        imgClassName="h-[24rem] w-auto lg:h-[32rem]"
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="motion-safe:[animation:hero-rise_0.5s_ease-out_both] inline-flex items-center gap-2 rounded-full border border-crema/25 bg-crema/10 px-4 py-2 text-sm font-semibold text-crema backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-coral" aria-hidden />
          {t.hero.urgencyBadge}
        </div>

        <h1 className="motion-safe:[animation:hero-rise_0.5s_ease-out_0.1s_both] mt-6 text-6xl leading-[0.95] font-bold tracking-tight text-crema sm:text-7xl md:text-8xl">
          <span className="block font-display font-semibold italic">
            {accent}
          </span>
          <span className="block">{rest}</span>
        </h1>

        <p className="motion-safe:[animation:hero-rise_0.5s_ease-out_0.2s_both] mt-6 max-w-2xl text-lg text-crema/85 italic sm:text-xl">
          {t.hero.subtitle}
        </p>

        <div className="motion-safe:[animation:hero-rise_0.5s_ease-out_0.3s_both] mt-10 flex flex-col items-center gap-4">
          <CTAButton surface="dark" href="#inversion">
            {t.hero.ctaPrimary}
          </CTAButton>
          <a
            href="#como-funciona"
            className="text-sm font-semibold text-crema/85 underline-offset-4 transition-colors hover:text-crema hover:underline"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
