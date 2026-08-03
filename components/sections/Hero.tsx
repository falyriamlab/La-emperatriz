import { CTAButton } from "@/components/CTAButton";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-crema px-6 py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[32rem] w-[32rem] rounded-full bg-lila/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-morado-oscuro/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="text-sm font-bold tracking-[0.2em] text-coral">
          MENTORÍA CULTURAL · PUENTE
        </span>

        <h1 className="font-display mt-6 text-5xl leading-[1.05] font-semibold italic text-morado-oscuro sm:text-6xl lg:text-7xl">
          La Emperatriz es la mentoría que necesitamos todas.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-negro/70 italic sm:text-xl">
          Un proceso de acompañamiento para que tu proyecto cultural se
          encamine, germine y se expanda — desde la sensibilidad, el gozo y
          la estructura.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-morado-oscuro/15 bg-white/50 px-4 py-2 text-sm font-semibold text-morado-oscuro">
          <span className="h-2 w-2 rounded-full bg-coral" aria-hidden />
          Cupos de lanzamiento limitados
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <CTAButton variant="primary" href="#inversion">
            Comenzar mi proceso
          </CTAButton>
          <a
            href="#como-funciona"
            className="text-sm font-semibold text-morado-oscuro/70 underline-offset-4 transition-colors hover:text-morado-oscuro hover:underline"
          >
            Conoce cómo funciona ↓
          </a>
        </div>
      </div>
    </section>
  );
}
