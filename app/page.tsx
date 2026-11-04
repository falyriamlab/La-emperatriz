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
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/Footer";
import { ContactModalProvider } from "@/components/ContactModal";

// Page order lives here — reorder this list to move sections around.
// Keep background alternation in mind: each section's own bg is set in
// its component (e.g. FAQ crema → FinalCTA morado). The contact form isn't
// a section: it opens in a modal (components/ContactModal.tsx) from buttons
// in Pricing and FinalCTA.
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
  { id: "final-cta", Component: FinalCTA },
];

export default function Home() {
  return (
    <ContactModalProvider>
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
    </ContactModalProvider>
  );
}
