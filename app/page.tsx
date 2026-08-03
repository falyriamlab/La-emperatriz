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

export default function Home() {
  return (
    <>
      <Hero />
      <Pain />
      <WhatIs />
      <WhoFor />
      <HowItWorks />
      <Mentor />
      <Trust />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
