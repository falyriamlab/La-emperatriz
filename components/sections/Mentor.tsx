"use client";

import Image from "next/image";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { BASE_PATH } from "@/lib/basePath";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Mentor() {
  const { t } = useLanguage();

  return (
    <section
      id="mentora"
      className="overflow-hidden bg-lila/10 px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
            {t.mentor.title}
          </h2>
        </Reveal>

        <Reveal className="mt-16 grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative mx-auto w-full max-w-sm">
            <DecorativeSvg
              src="/elements/hand-star.svg"
              width={500}
              height={654}
              className="absolute -top-10 -right-10 z-0 hidden opacity-40 sm:block"
              imgClassName="h-40 w-auto sm:h-48"
            />
            <div className="group relative z-10 aspect-[4/5] w-full overflow-hidden rounded-2xl mentor-photo-fade">
              <Image
                src={`${BASE_PATH}/elements/daniela.png`}
                alt={t.mentor.name}
                fill
                sizes="(min-width: 768px) 24rem, 100vw"
                className="object-contain object-bottom motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
              />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-morado-oscuro">
              {t.mentor.name}
            </h3>
            <p className="mt-1 text-sm font-semibold tracking-wide text-coral uppercase">
              {t.mentor.role}
            </p>

            <p className="mt-6 text-base leading-relaxed text-negro/75">
              {t.mentor.bio}
            </p>

            <blockquote className="mt-8 border-l-4 border-coral pl-6 text-xl leading-relaxed font-semibold text-morado-oscuro italic">
              &ldquo;{t.mentor.mission}&rdquo;
            </blockquote>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
