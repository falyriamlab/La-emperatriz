import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad — La Emperatriz",
  description: "Qué datos personales trata Puente, para qué, durante cuánto tiempo y cómo ejercer tus derechos.",
};

export default function PrivacidadPage() {
  return <LegalPage doc="privacidad" />;
}
