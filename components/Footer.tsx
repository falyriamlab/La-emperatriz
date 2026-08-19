"use client";

import Image from "next/image";
import { BASE_PATH } from "@/lib/basePath";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-crema px-6 py-10 text-center">
      <Image
        src={`${BASE_PATH}/logo/logo-horizontal-morado.svg`}
        alt=""
        aria-hidden="true"
        width={666}
        height={102}
        className="mx-auto h-6 w-auto"
      />
      <p className="mt-4 text-sm font-bold text-morado-oscuro">Puente</p>
      <p className="mt-2 text-sm text-negro/60">{t.footer.email}</p>
      <p className="mt-1 text-sm text-negro/60">{t.footer.instagram}</p>
    </footer>
  );
}
