import type { ComponentType } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { Pain } from "@/components/sections/Pain";
import { WhatIs } from "@/components/sections/WhatIs";
import { WhoFor } from "@/components/sections/WhoFor";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Mentor } from "@/components/sections/Mentor";
import { Trust } from "@/components/sections/Trust";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { ContactForm } from "@/components/sections/ContactForm";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/Footer";
import { FORMS_READY } from "@/lib/features";

// Page order lives here — reorder this list to move sections around.
// Keep background alternation in mind: each section's own bg is set in
// its component (e.g. FAQ crema → ContactForm amarillo → FinalCTA morado).
// Header and Footer sit outside <main> (they're their own landmarks).
// Entries with `enabled: false` are left out of the build entirely.
const SECTIONS: { id: string; Component: ComponentType; enabled?: boolean }[] = [
  { id: "hero", Component: Hero },
  { id: "pain", Component: Pain },
  { id: "what-is", Component: WhatIs },
  { id: "who-for", Component: WhoFor },
  { id: "how-it-works", Component: HowItWorks },
  { id: "mentor", Component: Mentor },
  { id: "trust", Component: Trust },
  { id: "pricing", Component: Pricing },
  { id: "faq", Component: FAQ },
  // Hidden until it has a leads endpoint and a privacy policy (lib/features.ts).
  // Without it, FAQ (crema) is followed directly by FinalCTA (morado).
  { id: "contact-form", Component: ContactForm, enabled: FORMS_READY },
  { id: "final-cta", Component: FinalCTA },
];

export default function Home() {
  return (
    <>
      <Header />
      {/* Target of the header's "skip to content" link (which focuses it
          itself — no permanent tabIndex here, or any mouse click inside the
          page would focus <main> and send the next Tab back to the top). */}
      <main id="contenido" className="focus:outline-none">
        {SECTIONS.filter(({ enabled = true }) => enabled).map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
      <Footer />
    </>
  );
}
