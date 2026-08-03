export function Mentor() {
  return (
    <section id="mentora" className="bg-lila/10 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
          Tu guía en este proceso
        </h2>

        <div className="mt-16 grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-2xl bg-lila">
            <span className="text-sm font-bold tracking-[0.2em] text-crema">
              FOTO DANIELA
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-morado-oscuro">
              Daniela Betancourt
            </h3>
            <p className="mt-1 text-sm font-semibold tracking-wide text-coral uppercase">
              Fundadora de Puente · Gestora Cultural
            </p>

            <p className="mt-6 text-base leading-relaxed text-negro/75">
              Profesional en Literatura hispanoamericana, con dos másters
              —en Gestión Cultural y en Cooperación Internacional y
              Políticas Públicas— y un posgrado en Políticas Culturales
              Comunitarias. Cuenta con 8 años de experiencia en el sector
              cultural: en el sector público de su país, en organismos
              multilaterales, y acompañando a creadoras y creadores
              culturales a desarrollar sus proyectos.
            </p>

            <blockquote className="mt-8 border-l-4 border-coral pl-6 text-xl leading-relaxed font-semibold text-morado-oscuro italic">
              &ldquo;Mi norte de vida es reivindicar la sensibilidad a
              través de la diversidad y la soberanía cultural. Sueño con
              una comunidad viva que nos ayude a sentirnos acompañadas y
              sostenidas. Justo por eso creé Puente.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
