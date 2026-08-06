import { CTAButton } from "@/components/CTAButton";
import { Reveal } from "@/components/Reveal";

const CUPOS_DISPONIBLES = 6;
const CUPOS_TOTALES = 10;
const FECHA_LIMITE = "2026-09-15"; // formato YYYY-MM-DD, ajustar cuando Daniela lo defina

const STRIPE_LINK_INDIVIDUAL = "https://buy.stripe.com/eVqaEXdSufHY7200x2djO01";
const STRIPE_LINK_GRUPO = "https://buy.stripe.com/eVqaEXdSufHY7200x2djO01"; // TODO: reemplazar por link de Stripe específico para grupo cuando esté creado

export function Pricing() {
  return (
    <section id="inversion" className="bg-crema px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold italic text-morado-oscuro sm:text-4xl">
            Invierte en tu proceso
          </h2>
          <p className="mt-4 text-lg text-negro/70">
            Cupos de lanzamiento limitados.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-4 py-2 text-sm font-semibold text-coral">
            <span className="h-2 w-2 rounded-full bg-coral" aria-hidden />
            Quedan {CUPOS_DISPONIBLES} de {CUPOS_TOTALES} cupos
          </div>

          <div className="mt-14 grid gap-8 text-left md:grid-cols-2">
            {/* Individual */}
            <div className="flex flex-col rounded-3xl border border-morado-oscuro/10 bg-white/70 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-morado-oscuro">
                Individual
              </h3>
              <p className="mt-2 text-base text-negro/70">
                Acompañamiento 1:1, 100% personalizado a tu proyecto.
              </p>

              <div className="mt-8 flex items-end gap-3">
                <span className="text-lg text-lila/80 line-through">
                  111€/mes
                </span>
                <span className="text-5xl font-extrabold text-morado-oscuro">
                  88€/mes
                </span>
              </div>

              <CTAButton
                surface="light"
                href={STRIPE_LINK_INDIVIDUAL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10"
              >
                Comenzar mi proceso individual
              </CTAButton>
            </div>

            {/* Grupo personalizado */}
            <div className="flex flex-col rounded-3xl border border-morado-oscuro/10 bg-white/70 p-10 shadow-sm">
              <h3 className="text-xl font-bold text-morado-oscuro">
                Grupo personalizado
              </h3>
              <p className="mt-2 text-base text-negro/70">
                Grupos de 2 a 4 participantes, acompañadas en comunidad.
              </p>

              <div className="mt-8 flex items-end gap-3">
                <span className="text-lg text-lila/80 line-through">
                  60€/mes
                </span>
                <span className="text-5xl font-extrabold text-morado-oscuro">
                  44€/mes
                </span>
              </div>

              <CTAButton
                surface="light"
                href={STRIPE_LINK_GRUPO}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10"
              >
                Comenzar mi proceso grupal
              </CTAButton>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-sm text-negro/50">
            4 meses de acompañamiento · 2 sesiones al mes · Pago mensual, sin
            permanencia forzosa
          </p>
        </Reveal>
      </div>
    </section>
  );
}
