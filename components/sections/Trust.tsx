const stats = [
  {
    value: "6",
    valueClass: "text-5xl sm:text-6xl",
    label: "países acompañados: Colombia, España, Brasil, Francia, Portugal y Chile.",
  },
  {
    value: "Danza, teatro, música, artes visuales",
    valueClass: "text-2xl sm:text-3xl",
    label: "disciplinas culturales acompañadas.",
  },
  {
    value: "8 años",
    valueClass: "text-5xl sm:text-6xl",
    label: "de experiencia en gestión cultural.",
  },
];

export function Trust() {
  return (
    <section id="confianza" className="bg-morado-oscuro px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl font-semibold italic text-crema sm:text-4xl">
          Un camino ya recorrido
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-crema/70">
          Puente ha acompañado proyectos culturales iberoamericanos en
          distintos ámbitos y países. Este proceso nace de esa experiencia
          real.
        </p>

        <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-3">
              <span className={`font-extrabold text-amarillo ${stat.valueClass}`}>
                {stat.value}
              </span>
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
      </div>
    </section>
  );
}
