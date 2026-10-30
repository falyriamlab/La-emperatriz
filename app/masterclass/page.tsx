import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MasterclassForm } from "@/components/masterclass/MasterclassForm";

// Reached only through the shared link: nothing on the landing points here,
// and search engines are asked not to list it.
export const metadata: Metadata = {
  title: "Masterclass — Inscripción | Puente",
  description: "Inscríbete a la masterclass de Puente, consultora de gestión cultural.",
  robots: { index: false, follow: false },
};

export default function MasterclassPage() {
  return (
    <>
      <Header showCta={false} />
      {/* Target of the header's "skip to content" link. */}
      <main id="contenido" className="focus:outline-none">
        <MasterclassForm />
      </main>
      <Footer />
    </>
  );
}
