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

// Page order lives here — reorder this list to move sections around.
// Keep background alternation in mind: each section's own bg is set in
// its component (e.g. FAQ crema → ContactForm amarillo → FinalCTA morado).
const SECTIONS: { id: string; Component: ComponentType }[] = [
  { id: "header", Component: Header },
  { id: "hero", Component: Hero },
  { id: "pain", Component: Pain },
  { id: "what-is", Component: WhatIs },
  { id: "who-for", Component: WhoFor },
  { id: "how-it-works", Component: HowItWorks },
  { id: "mentor", Component: Mentor },
  { id: "trust", Component: Trust },
  { id: "pricing", Component: Pricing },
  { id: "faq", Component: FAQ },
  { id: "contact-form", Component: ContactForm },
  { id: "final-cta", Component: FinalCTA },
  { id: "footer", Component: Footer },
];

export default function Home() {
  return (
    <>
      {SECTIONS.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
