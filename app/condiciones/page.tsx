import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Condiciones de compra — La Emperatriz",
  description: "Condiciones de compra de La Emperatriz, la mentoría individual de Puente.",
};

export default function CondicionesPage() {
  return <LegalPage doc="condiciones" />;
}
