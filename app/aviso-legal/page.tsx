import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Aviso legal — La Emperatriz",
  description: "Titular de la web de La Emperatriz y condiciones de uso.",
};

export default function AvisoLegalPage() {
  return <LegalPage doc="aviso-legal" />;
}
