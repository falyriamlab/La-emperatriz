import { CTAButton } from "@/components/CTAButton";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";

export function FinalCTA() {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden bg-morado-oscuro px-6 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-[26rem] w-[26rem] rounded-full bg-amarillo/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-32 h-[28rem] w-[28rem] rounded-full bg-coral/15 blur-3xl"
      />
      <DecorativeSvg
        src="/elements/galaxy.svg"
        className="absolute inset-0 opacity-[0.12]"
        imgClassName="object-cover"
      />
      <DecorativeSvg
        src="/elements/stamp.svg"
        className="absolute top-10 right-10 z-10 hidden h-28 w-28 opacity-90 sm:block sm:h-32 sm:w-32"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="font-display text-4xl leading-[1.1] font-semibold italic text-crema sm:text-5xl">
          Tu proyecto cultural merece un proceso que lo sostenga.
        </h2>
        <p className="mt-6 text-lg text-crema/80">
          Cupos de lanzamiento limitados. Empieza tu proceso hoy.
        </p>

        <CTAButton surface="dark" href="#inversion" className="mt-10">
          Comenzar mi proceso
        </CTAButton>

        <p className="mt-8 text-sm font-semibold tracking-wide text-crema/60">
          Un proceso de Puente · Consultora Cultural
        </p>
      </div>
    </section>
  );
}
