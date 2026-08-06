import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    number: "01",
    title: "Duración",
    desc: "4 meses de acompañamiento continuo, tiempo suficiente para encaminar tu proyecto sin prisa.",
  },
  {
    number: "02",
    title: "Encuentros",
    desc: "2 sesiones de trabajo al mes, enfocadas en tu proceso y tus próximos pasos.",
  },
  {
    number: "03",
    title: "Modalidad",
    desc: "Elige entre acompañamiento individual o en grupo personalizado (2 a 4 participantes).",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-crema px-6 py-20 sm:py-28"
    >
      <DecorativeSvg
        src="/elements/protons-morado.svg"
        className="absolute top-8 -right-10 hidden h-40 w-40 opacity-[0.15] sm:block"
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
            ¿Cómo funciona el proceso?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-negro/70">
            Un acompañamiento simple, constante y enfocado en tu proyecto.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-start gap-3 rounded-2xl border border-morado-oscuro/10 bg-white/70 p-8 text-left shadow-sm"
              >
                <span className="text-4xl font-extrabold text-amarillo">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-morado-oscuro">
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed text-negro/70">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
