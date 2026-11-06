// Build-time loader for the approved legal texts in content/legal/<lang>/.
// Only imported from the legal pages (server components), so `fs` runs
// during the static export and never ships to the browser.
import fs from "node:fs";
import path from "node:path";
import type { Language } from "@/lib/i18n/LanguageContext";
import { parseMarkdown, type Block } from "@/lib/markdown";

export type LegalDoc = "condiciones" | "privacidad" | "aviso-legal";
export type LegalDocs = Record<Language, Block[]>;

export function loadLegalDoc(doc: LegalDoc): LegalDocs {
  const read = (lang: Language) =>
    parseMarkdown(fs.readFileSync(path.join(process.cwd(), "content", "legal", lang, `${doc}.md`), "utf8"));
  return { es: read("es"), pt: read("pt") };
}
