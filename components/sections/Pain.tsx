const points = [
  {
    text: "Tienes un proyecto cultural que amas, pero no sabes cómo darle una estructura que lo sostenga en el tiempo.",
    icon: (
      <div className="flex flex-col items-center gap-1.5" aria-hidden>
        <span className="h-1.5 w-8 rounded-full bg-morado-oscuro" />
        <span className="h-1.5 w-5 rounded-full bg-morado-oscuro/50" />
      </div>
    ),
  },
  {
    text: "Sientes que avanzas sola, sin una mirada externa que te ayude a ver con claridad el siguiente paso.",
    icon: (
      <div className="relative h-8 w-8" aria-hidden>
        <span className="absolute top-0 left-0 h-6 w-6 rounded-full border-2 border-morado-oscuro" />
        <span className="absolute right-0 bottom-0 h-4 w-4 rounded-full bg-coral" />
      </div>
    ),
  },
  {
    text: "Te cuesta encontrar el balance entre la sensibilidad artística de tu proyecto y la disciplina que necesita para crecer.",
    icon: (
      <div className="flex items-center gap-2" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-morado-oscuro" />
        <span className="h-0.5 w-6 bg-morado-oscuro/30" />
        <span className="h-3 w-3 bg-coral" />
      </div>
    ),
  },
];

export function Pain() {
  return (
    <section
      id="dolor"
      className="border-t border-morado-oscuro/10 bg-lila/10 px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
          ¿Te suena familiar?
        </h2>

        <div className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {points.map((point) => (
            <div
              key={point.text}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/60">
                {point.icon}
              </div>
              <p className="text-base leading-relaxed text-negro/75">
                {point.text}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-2xl font-bold text-coral italic sm:text-3xl">
          Para eso existe La Emperatriz.
        </p>
      </div>
    </section>
  );
}
