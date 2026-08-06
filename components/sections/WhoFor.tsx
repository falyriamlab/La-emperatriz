import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";

const goodFit = [
  "Eres una creadora cultural latinoamericana que ama lo que hace.",
  "Tienes un proyecto cultural o creativo en marcha, o a punto de arrancar.",
  "Buscas una mirada estratégica que te ayude a encaminar y expandir lo que estás creando.",
  "Quieres avanzar acompañada, no sola.",
];

const notFit = [
  "Buscas una fórmula genérica sin personalización.",
  "No estás dispuesta a comprometerte con un proceso de 4 meses.",
  "Esperas resultados sin poner tu propio trabajo y reflexión en el camino.",
];

export function WhoFor() {
  return (
    <section id="para-quien" className="bg-crema px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <DecorativeSvg
              src="/elements/star.svg"
              className="relative h-8 w-8 shrink-0 opacity-80"
            />
            <h2 className="text-center text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
              ¿Para quién es esta mentoría?
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-lg font-bold text-morado-oscuro">
                Es para ti si...
              </h3>
              <ul className="mt-6 flex flex-col gap-4">
                {goodFit.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amarillo/25 text-xs font-bold text-coral"
                    >
                      ✓
                    </span>
                    <span className="text-base leading-relaxed text-negro/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-morado-oscuro">
                No es para ti si...
              </h3>
              <ul className="mt-6 flex flex-col gap-4">
                {notFit.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center text-sm font-bold text-lila/70"
                    >
                      —
                    </span>
                    <span className="text-base leading-relaxed text-negro/55">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
