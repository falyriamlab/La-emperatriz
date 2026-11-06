import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { loadLegalDoc, type LegalDoc } from "@/lib/legalContent";

/**
 * Shared shell of /condiciones, /privacidad and /aviso-legal: the landing's
 * header (without "Comenzar mi proceso") and footer around the text, read
 * from content/legal/<lang>/<doc>.md at build time.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Header showCta={false} />
      {/* Target of the header's "skip to content" link. */}
      <main id="contenido" className="focus:outline-none">
        <LegalDocument docs={loadLegalDoc(doc)} />
      </main>
      <Footer />
    </>
  );
}
