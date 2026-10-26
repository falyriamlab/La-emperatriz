"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import { RiDoubleQuotesL } from "react-icons/ri";
import { ChevronDown } from "@/components/icons/ChevronDown";
import { Reveal } from "@/components/Reveal";
import { BASE_PATH } from "@/lib/basePath";
import { getCountryName } from "@/lib/countries";
import { useLanguage, type Language } from "@/lib/i18n/LanguageContext";

type Testimonial = {
  id: string;
  initial: string;
  role: string;
  countries: string[];
  paragraphs: string[];
};

// Monogram pairings, alternated by position. Both verified AA for the bold
// initial: crema on morado-oscuro 6.8:1, morado-oscuro on amarillo 4.65:1.
// (Never crema on coral — 3.7:1.)
const MONOGRAM_STYLES = [
  "bg-morado-oscuro text-crema",
  "bg-amarillo text-morado-oscuro",
];

// Fixed per-position tilt (never random: server and client must render the
// same thing). Scaled ×0.6 below lg via --tilt-scale.
const TILTS = ["-1.4deg", "1deg", "-0.8deg", "1.3deg", "-1.1deg"];

// Left gutter that lines the carousel's first card (and the title) up with
// Trust's centered max-w-4xl (56rem) content, never less than its px-6.
// Declared as a custom property and only resolved where it's used, so the
// % is always taken against the full-width wrapper.
const GUTTER = "max(1.5rem, calc((100% - 56rem) / 2))";

// Below this many px from either end counts as "at the end" for the arrows.
const EDGE_TOLERANCE = 4;

const FOCUS_RING_DARK =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-morado-oscuro";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function TestimonialCard({
  item,
  index,
  language,
  readMore,
  readLess,
}: {
  item: Testimonial;
  index: number;
  language: Language;
  readMore: string;
  readLess: string;
}) {
  const textId = useId();
  const textRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  // The clamp is purely visual (full text stays in the DOM), so whether a
  // card needs "Leer más" depends on the rendered width and language. Only
  // measurable while collapsed; once expanded the button stays so the card
  // can be collapsed again.
  useEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // Web fonts can change line breaks without resizing the clamped box.
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [expanded, item.paragraphs]);

  // Tilt = --tilt × --tilt-scale (0.6 below lg) × --tilt-on. --tilt-on drops
  // to 0 — card straightens — while expanded (inline) or while something
  // inside has *keyboard* focus (:has(:focus-visible), not focus-within: a
  // mouse click leaves focus on the button, which would keep the card
  // straight after "Leer menos"). Only the transition is motion-safe.
  const style = {
    "--tilt": TILTS[index % TILTS.length],
    ...(expanded ? { "--tilt-on": 0 } : {}),
  } as CSSProperties;

  return (
    <figure
      style={style}
      className="flex flex-col rounded-3xl bg-[color-mix(in_srgb,var(--color-crema)_45%,white)] p-6 text-left shadow-lg shadow-negro/20 [--tilt-on:1] [--tilt-scale:0.6] [rotate:calc(var(--tilt)*var(--tilt-scale)*var(--tilt-on))] has-[:focus-visible]:[--tilt-on:0] sm:p-7 lg:[--tilt-scale:1] motion-safe:transition-[rotate] motion-safe:duration-300 motion-safe:ease-out"
    >
      <RiDoubleQuotesL aria-hidden="true" className="h-10 w-10 flex-none text-amarillo" />

      <blockquote className="mt-3">
        <div
          ref={textRef}
          id={textId}
          // Clamped only under the js: variant: without JavaScript (or if it
          // never hydrates) there is no working "Leer más" button, so the
          // full quote is shown.
          className={`space-y-4 text-base leading-relaxed text-negro/85 ${
            expanded ? "" : "js:line-clamp-11"
          }`}
        >
          {item.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </blockquote>

      {(clamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={textId}
          className={`mt-2 inline-flex min-h-11 min-w-11 cursor-pointer items-center self-start rounded-md text-sm font-bold text-morado-oscuro underline underline-offset-4 hover:text-coral ${FOCUS_RING_DARK}`}
        >
          {expanded ? readLess : readMore}
        </button>
      )}

      <figcaption className="mt-auto flex items-center gap-4 pt-6">
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-full text-lg font-extrabold ${
            MONOGRAM_STYLES[index % MONOGRAM_STYLES.length]
          }`}
        >
          {item.initial}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-sm font-bold text-morado-oscuro">{item.role}</span>
          {/* Flag is decorative — the country name is always visible text.
              Separator trick: every item carries its "·" in a left gutter,
              the row is pulled left by that gutter and the wrapper clips it.
              So the dot only shows *between* countries on the same line —
              when a country wraps, its dot falls into the clipped area
              instead of dangling at the start of the new line. */}
          <span className="overflow-hidden">
            <span className="-ml-4 flex flex-wrap items-center gap-y-1 text-sm text-negro/75">
              {item.countries.map((code) => (
                <span key={code} className="relative inline-flex items-center gap-1.5 pl-4">
                  <span aria-hidden="true" className="absolute left-1">
                    ·
                  </span>
                  <Image
                    src={`${BASE_PATH}/flags/${code.toLowerCase()}.svg`}
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={14}
                    className="h-[14px] w-5 rounded-[2px] object-cover ring-1 ring-negro/20"
                  />
                  {getCountryName(code, language)}
                </span>
              ))}
            </span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function ArrowButton({
  direction,
  label,
  atEdge,
  onActivate,
}: {
  direction: "prev" | "next";
  label: string;
  atEdge: boolean;
  onActivate: () => void;
}) {
  // aria-disabled (not `disabled`) so the button keeps focus when it
  // reaches the end; the click handler is what becomes a no-op.
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={atEdge}
      onClick={() => {
        if (!atEdge) onActivate();
      }}
      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-crema/80 text-crema focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crema ${
        atEdge
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer hover:bg-crema hover:text-morado-oscuro motion-safe:transition-colors motion-safe:duration-200"
      }`}
    >
      <ChevronDown
        className={`h-5 w-5 ${direction === "prev" ? "rotate-90" : "-rotate-90"}`}
      />
    </button>
  );
}

export function Testimonials() {
  const { t, language } = useLanguage();
  const tt = t.trust.testimonials;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const start = el.scrollLeft <= EDGE_TOLERANCE;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - EDGE_TOLERANCE;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  // Re-check on mount, on any size change (viewport, card expanding) and
  // when the language swaps the text.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    updateEdges();
    return () => observer.disconnect();
  }, [updateEdges, language]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  function handleScroll() {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      updateEdges();
    });
  }

  /** One step = first card's width + the list's gap, read from the DOM. */
  function scrollStep(direction: 1 | -1) {
    const el = scrollerRef.current;
    const list = el?.querySelector("ul");
    const first = list?.querySelector("li");
    if (!el || !list || !first) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    el.scrollBy({
      left: direction * (first.offsetWidth + gap),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  // Tabbing to a "Leer más" in an off-screen card: the browser only scrolls
  // the button itself into view, so bring the whole card in. The visible
  // zone starts at the list's padding-left (= the scroller's
  // scroll-padding-left). We scroll to the card's own snap position rather
  // than inline: "nearest": with mandatory snapping, an in-between offset
  // gets re-snapped to a neighbouring card and can leave this one cut off.
  function revealCard(event: FocusEvent<HTMLLIElement>) {
    const scroller = scrollerRef.current;
    const list = scroller?.querySelector("ul");
    if (!scroller || !list) return;
    const card = event.currentTarget.getBoundingClientRect();
    const view = scroller.getBoundingClientRect();
    const zoneLeft = view.left + parseFloat(getComputedStyle(list).paddingLeft);
    const fullyVisible = card.left >= zoneLeft - 1 && card.right <= view.right + 1;
    if (fullyVisible) return;
    scroller.scrollTo({
      left: scroller.scrollLeft + (card.left - zoneLeft),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  return (
    // overflow-x: clip (not 100vw, which overflows under Windows scrollbars):
    // the track bleeds to the section's right edge without page scroll.
    <div
      style={{ "--gutter": GUTTER } as CSSProperties}
      className="relative mt-24 overflow-x-clip sm:mt-28 lg:grid lg:grid-cols-[minmax(15rem,30%)_minmax(0,1fr)] lg:items-start lg:gap-x-12 lg:pl-[var(--gutter)]"
    >
      <Reveal className="pr-6 pl-[var(--gutter)] text-left lg:pt-8 lg:pr-0 lg:pl-0">
        <h3 className="font-display text-3xl leading-tight font-semibold italic text-crema sm:text-4xl lg:text-5xl">
          {tt.title}
        </h3>
        <p className="mt-4 max-w-xl text-lg text-crema/80">{tt.subtitle}</p>
        {tt.translationNote && (
          <p className="mt-4 max-w-xl text-sm text-crema/85">{tt.translationNote}</p>
        )}
      </Reveal>

      <Reveal className="mt-8 min-w-0 lg:mt-0">
        <div
          ref={scrollerRef}
          role="region"
          aria-label={tt.carouselLabel}
          tabIndex={0}
          onScroll={handleScroll}
          className="snap-x snap-mandatory scroll-pl-[var(--gutter)] overflow-x-auto [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-crema lg:scroll-pl-3 [&::-webkit-scrollbar]:hidden"
        >
          {/* Padding lives on the list (w-max), not the scroller, so the
              trailing pr-8 is reliably part of the scrollable width.
              pt/pb leave room for the tilt and for "Leer más" growth. */}
          <ul className="flex w-max items-start gap-5 pt-6 pr-8 pb-10 pl-[var(--gutter)] lg:pl-3">
            {tt.items.map((item, index) => (
              <li
                key={item.id}
                onFocus={revealCard}
                className="w-[min(82vw,20rem)] flex-none snap-start lg:w-80"
              >
                <TestimonialCard
                  item={item}
                  index={index}
                  language={language}
                  readMore={tt.readMore}
                  readLess={tt.readLess}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center gap-4 px-6 lg:px-0">
          <ArrowButton
            direction="prev"
            label={tt.prev}
            atEdge={edges.start}
            onActivate={() => scrollStep(-1)}
          />
          <ArrowButton
            direction="next"
            label={tt.next}
            atEdge={edges.end}
            onActivate={() => scrollStep(1)}
          />
        </div>
      </Reveal>
    </div>
  );
}
