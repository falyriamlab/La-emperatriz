"use client";

import { MdCheck } from "react-icons/md";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Shared by the purpose card and the 3 step cards so they stay one visual
// family: same shape, padding and lift-on-hover. Only the surface differs.
const CARD_BASE =
  "group relative overflow-hidden rounded-2xl p-8 text-left shadow-sm motion-safe:transition-[transform,box-shadow] motion-safe:duration-[250ms] motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md";
const STEP_CARD_CLASS = `${CARD_BASE} border border-morado-oscuro/10 bg-white/70`;
const PURPOSE_CARD_CLASS = `${CARD_BASE} bg-morado-oscuro text-crema`;
const NUMBER_CLASS = "text-4xl font-extrabold text-amarillo";
const TITLE_CLASS = "text-xl font-bold";

/** Card numbers come from their position (purpose first), not the dictionary. */
const cardNumber = (position: number) => String(position).padStart(2, "0");

/* Bottom accent line — thickens + recolors on hover. State change
   (height/color) is unconditional so it still fires under reduced motion;
   only the transition is motion-safe. `restClass`: resting color, so the
   line is also visible on the dark purpose card. */
function AccentLine({ restClass = "bg-morado-oscuro/15" }: { restClass?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 h-0.5 ${restClass} group-hover:h-1 group-hover:bg-coral motion-safe:transition-[height,background-color] motion-safe:duration-[250ms] motion-safe:ease-out`}
    />
  );
}

export function HowItWorks() {
  const { t } = useLanguage();
  const purpose = t.howItWorks.purpose;

  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-crema px-6 py-20 sm:py-28"
    >
      <DecorativeSvg
        src="/elements/protons-morado.svg"
        width={500}
        height={561}
        className="absolute top-8 -right-10 hidden opacity-[0.15] sm:block"
        imgClassName="h-40 w-auto"
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-negro/70">
            {t.howItWorks.subtitle}
          </p>
        </Reveal>

        {/* Purpose first, full width: number + title on the left and the
            content at reading width on the right from md up; stacked on
            mobile. */}
        <Reveal className="mt-16">
          <div
            className={`${PURPOSE_CARD_CLASS} flex flex-col gap-4 md:flex-row md:items-start md:gap-12`}
          >
            <div className="flex flex-col items-start gap-3 md:w-48 md:flex-none">
              <span className={NUMBER_CLASS}>{cardNumber(1)}</span>
              <h3 className={`${TITLE_CLASS} text-crema`}>{purpose.title}</h3>
            </div>
            <div className="flex max-w-prose flex-col gap-4 text-base leading-relaxed">
              <p className="text-xl font-semibold leading-snug sm:text-2xl">
                {purpose.lead}
              </p>
              <p className="text-crema/90">{purpose.intro}</p>
              {/* role="list": Safari drops list semantics when list-style is none. */}
              <ul role="list" className="flex flex-col gap-2">
                {purpose.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <MdCheck
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 flex-none text-amarillo"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-crema/90">{purpose.more}</p>
              <p className="border-t border-crema/20 pt-4 text-sm text-crema/80">
                {purpose.note}
              </p>
            </div>
            <AccentLine restClass="bg-crema/25" />
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-3 sm:gap-8">
            {t.howItWorks.steps.map((step, index) => (
              <div
                key={step.title}
                className={`${STEP_CARD_CLASS} flex flex-col items-start gap-3`}
              >
                <span className={NUMBER_CLASS}>{cardNumber(index + 2)}</span>
                <h3 className={`${TITLE_CLASS} text-morado-oscuro`}>{step.title}</h3>
                <p className="text-base leading-relaxed text-negro/70">
                  {step.desc}
                </p>
                <AccentLine />
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-xl text-sm text-negro/70">
            {t.howItWorks.extras}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
