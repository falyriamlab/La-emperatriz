// Section titles (h2) on the landing: the brand serif in italics, one size,
// weight and line height for all of them. Color is added where used —
// text-morado-oscuro on light backgrounds, text-crema on morado ones.
// Not for the Hero's h1 (mixes serif and sans on purpose) or card titles
// and subtitles (h3, sans bold).
const SECTION_TITLE_FONT = "font-display font-semibold italic";

export const SECTION_TITLE_CLASS = `${SECTION_TITLE_FONT} text-3xl sm:text-4xl`;

// Deliberate exception, like the Hero's h1: the closing section's title
// ("Hablemos antes de que decidas.") keeps the same serif but stays larger —
// 36px on mobile, 48px from sm, line height 1.1 — as the page's last call.
export const CLOSING_TITLE_CLASS = `${SECTION_TITLE_FONT} text-4xl leading-[1.1] sm:text-5xl`;
