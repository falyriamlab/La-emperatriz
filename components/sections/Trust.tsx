import { CountUp } from "@/components/CountUp";
import { DecorativeSvg } from "@/components/decorative/DecorativeSvg";
import { Reveal } from "@/components/Reveal";
import { RotatingWords } from "@/components/RotatingWords";

type Stat =
  | {
      kind: "count";
      end: number;
      suffix?: string;
      valueClass: string;
      label: string;
      delayMs?: number;
    }
  | {
      kind: "rotating";
      words: string[];
      valueClass: string;
      label: string;
    };

const stats: Stat[] = [
  {
    kind: "count",
    end: 6,
    valueClass: "text-5xl sm:text-6xl",
    label: "países acompañados: Colombia, España, Brasil, Francia, Portugal y Chile.",
    delayMs: 0,
  },
  {
    kind: "rotating",
    words: ["Danza", "Teatro", "Música", "Artes visuales"],
    // One word at a time now, so it can match the numeric stats' size
    // instead of the smaller size the old four-word line needed to fit.
    valueClass: "text-5xl sm:text-6xl",
    label: "disciplinas culturales acompañadas.",
  },
  {
    kind: "count",
    end: 8,
    suffix: " años",
    valueClass: "text-5xl sm:text-6xl",
    label: "de experiencia en gestión cultural.",
    delayMs: 150,
  },
];

export function Trust() {
  return (
    <section
      id="confianza"
      className="relative overflow-hidden bg-morado-oscuro px-6 py-20 sm:py-28"
    >
      <DecorativeSvg
        src="/elements/hand.svg"
        className="absolute top-1/2 -right-16 hidden h-[34rem] w-[22rem] -translate-y-1/2 opacity-[0.14] md:block"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold italic text-crema sm:text-4xl">
            Un camino ya recorrido
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-crema/70">
            Puente ha acompañado proyectos culturales iberoamericanos en
            distintos ámbitos y países. Este proceso nace de esa
            experiencia real.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-3"
              >
                {stat.kind === "count" ? (
                  <CountUp
                    end={stat.end}
                    suffix={stat.suffix}
                    delayMs={stat.delayMs}
                    className={`font-extrabold text-amarillo ${stat.valueClass}`}
                  />
                ) : (
                  <RotatingWords
                    words={stat.words}
                    className={`font-extrabold text-amarillo ${stat.valueClass}`}
                  />
                )}
                <p className="max-w-[16rem] text-sm text-crema/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-16 max-w-2xl text-sm text-crema/50">
            {
              "Parte de la Red de Emprendedores de la Comunidad de Madrid 'Madrid Emprende' y del tejido de emprendimientos reconocidos por 'Colombia nos une'."
            }
          </p>
        </Reveal>
      </div>
    </section>
  );
}
