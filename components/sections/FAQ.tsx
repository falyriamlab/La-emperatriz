"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Cómo elijo entre individual o grupo?",
    a: "El acompañamiento individual es 100% personalizado a tu proyecto y tu ritmo. El grupo personalizado (2 a 4 participantes) mantiene el enfoque en tu proyecto, pero suma la energía y el aprendizaje de acompañarte con otras creadoras culturales.",
  },
  {
    q: "¿Cómo es el pago?",
    a: "La inversión es mensual, durante los 4 meses del proceso.",
  },
  {
    q: "¿Qué pasa si no puedo asistir a una sesión?",
    a: "Escríbenos y buscamos juntas la mejor forma de reagendar dentro del mes, para que no pierdas tu espacio de acompañamiento.",
  },
  {
    q: "¿Necesito tener el proyecto ya definido para empezar?",
    a: "No. La Emperatriz también acompaña proyectos en etapa temprana — lo importante es que tengas la intención de encaminarlo con estructura y sensibilidad.",
  },
  {
    q: "¿En qué idioma son las sesiones?",
    a: "En español.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="preguntas" className="bg-crema px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-extrabold text-morado-oscuro sm:text-4xl">
          Preguntas frecuentes
        </h2>

        <div className="mt-14">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="border-b border-morado-oscuro/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-bold text-morado-oscuro">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className={`flex h-7 w-7 flex-none items-center justify-center text-2xl font-bold text-coral transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`pb-6 text-base leading-relaxed text-negro/70 transition-opacity duration-300 ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
