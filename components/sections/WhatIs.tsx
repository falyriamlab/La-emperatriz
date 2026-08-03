const pillars = [
  { word: "Sensibilidad", desc: "Honramos el alma de tu proyecto." },
  { word: "Gozo", desc: "Creamos desde la liviandad, no desde la presión." },
  { word: "Estructura", desc: "Le damos forma estratégica a tu visión." },
];

export function WhatIs() {
  return (
    <section id="que-es" className="bg-morado-oscuro px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-semibold italic text-crema sm:text-4xl">
          ¿Qué es La Emperatriz?
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-2xl leading-snug font-semibold text-crema sm:text-3xl">
          Es un proceso vivo de acompañamiento estratégico para contribuir al
          desarrollo orgánico de tu proyecto cultural, desde la
          sensibilidad, el gozo y la estructura.
        </p>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-crema/70">
          Cuando creamos desde un lugar coherente y alineado con nuestro
          propósito, de la mano de una guía y con una comunidad que nos
          sostiene, el proceso creativo se aliviana y se alinea con el norte
          de tu proyecto.
        </p>

        <div className="mt-16 flex flex-col items-center gap-10 sm:flex-row sm:items-stretch sm:justify-center sm:gap-0 sm:divide-x sm:divide-crema/20">
          {pillars.map((pillar) => (
            <div
              key={pillar.word}
              className="flex flex-col items-center gap-2 px-10 text-center"
            >
              <span className="text-2xl font-extrabold text-amarillo">
                {pillar.word}
              </span>
              <p className="max-w-[14rem] text-sm text-crema/70">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
