"use client";

import type { ReactNode } from "react";
import { FOCUS_RING } from "@/components/form/fields";
import { BASE_PATH } from "@/lib/basePath";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { LegalDocs } from "@/lib/legalContent";
import type { Block, Inline } from "@/lib/markdown";

const LINK_CLASS = `font-semibold text-morado-oscuro underline underline-offset-2 hover:text-coral ${FOCUS_RING}`;

function plainText(nodes: Inline[]): string {
  return nodes.map((n) => (n.type === "text" ? n.value : plainText(n.children))).join("");
}

function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((node, i) => {
    if (node.type === "text") return node.value;
    if (node.type === "strong") return <strong key={i}>{renderInline(node.children)}</strong>;
    // Internal pages (/privacidad, /condiciones…) stay in the tab; anything
    // else opens a new one. Plain <a>, not next/link: on the static export
    // its prefetch asks for a segment file name the export doesn't write
    // (404 in the console), and a full page load is all these need.
    return node.href.startsWith("/") ? (
      <a key={i} href={`${BASE_PATH}${node.href}`} className={LINK_CLASS}>
        {renderInline(node.children)}
      </a>
    ) : (
      <a key={i} href={node.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        {renderInline(node.children)}
      </a>
    );
  });
}

function renderBlocks(blocks: Block[]) {
  // Tables are labelled by the heading of their section (scrollable regions need a name).
  let section = "";
  return blocks.map((block, i) => {
    switch (block.type) {
      case "heading": {
        section = plainText(block.children);
        if (block.level === 1) {
          return (
            <h1 key={i} className="font-display text-4xl leading-tight font-semibold italic text-morado-oscuro sm:text-5xl">
              {renderInline(block.children)}
            </h1>
          );
        }
        if (block.level === 2) {
          return (
            <h2 key={i} className="font-display mt-12 text-2xl leading-snug font-semibold text-morado-oscuro sm:text-3xl">
              {renderInline(block.children)}
            </h2>
          );
        }
        return (
          <h3 key={i} className="mt-8 text-lg font-bold text-morado-oscuro">
            {renderInline(block.children)}
          </h3>
        );
      }
      case "paragraph":
        return (
          <p key={i} className="mt-4">
            {renderInline(block.children)}
          </p>
        );
      case "list": {
        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <ListTag
            key={i}
            className={`mt-4 flex flex-col gap-2 pl-6 marker:text-morado-oscuro ${block.ordered ? "list-decimal" : "list-disc"}`}
          >
            {block.items.map((item, j) => (
              <li key={j} className="pl-1">
                {renderInline(item)}
              </li>
            ))}
          </ListTag>
        );
      }
      case "table":
        return (
          // Own horizontal scroll on narrow screens, never the page's.
          // Focusable so keyboard users can scroll it too.
          <div
            key={i}
            role="region"
            aria-label={section}
            tabIndex={0}
            className={`mt-6 overflow-x-auto rounded-xl border border-morado-oscuro/15 bg-white ${FOCUS_RING}`}
          >
            {/* ~10rem per column (36rem minimum), so wide tables scroll
                instead of squeezing every cell to a word per line. */}
            <table
              style={{ minWidth: `${Math.max(36, block.head.length * 10)}rem` }}
              className="w-full border-collapse text-left text-sm leading-relaxed"
            >
              <thead className="bg-morado-oscuro/5">
                <tr>
                  {block.head.map((cell, j) => (
                    <th key={j} scope="col" className="px-4 py-3 align-bottom font-bold text-morado-oscuro">
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t border-morado-oscuro/10">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 align-top">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  });
}

/**
 * A legal page's text in the active language (ES on the server and
 * without JavaScript). `docs` comes already parsed from the build.
 */
export function LegalDocument({ docs }: { docs: LegalDocs }) {
  const { t, language } = useLanguage();

  return (
    <section className="bg-crema px-6 pt-10 pb-20 sm:pt-14 sm:pb-28">
      {/* ~70 characters per line. */}
      <div className="mx-auto max-w-[70ch] text-base leading-[1.75] text-negro/80">
        <a
          href={`${BASE_PATH}/`}
          className={`inline-flex min-h-11 items-center text-sm font-bold text-morado-oscuro underline-offset-4 hover:text-coral hover:underline ${FOCUS_RING}`}
        >
          {t.legalPage.back}
        </a>
        <article lang={language} className="mt-6">
          {renderBlocks(docs[language])}
        </article>
      </div>
    </section>
  );
}
