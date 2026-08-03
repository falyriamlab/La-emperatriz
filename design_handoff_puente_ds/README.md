# Handoff: Sistema de Diseño Puente

## Overview
Sistema de diseño de marca para **Puente**, consultora cultural ("Reivindicamos la sensibilidad, a través de la diversidad y la soberanía cultural"). Cubre paleta, tipografía, logotipo, elementos gráficos, plantillas de Instagram (feed y Stories), y una landing page de producto para la mentoría "La Emperatriz".

## About the Design Files
The files in this bundle are **design references built in HTML** (self-contained "Design Component" prototypes) — they show intended look, layout, and behavior, not production code to copy as-is. The task is to **recreate these HTML designs in the target codebase's existing environment** (React, Vue, native, etc.) using its established component patterns and libraries — or, if no environment exists yet, choose the most appropriate framework and implement the designs there.

## Fidelity
**High-fidelity (hifi)**: exact colors, typography, spacing and copy are final. Recreate pixel-perfectly using the codebase's own component/styling system rather than embedding this HTML directly.

## Design Tokens

### Colors
| Name | Hex | Usage |
|---|---|---|
| Rojo | `#EC2B43` | Color de impacto — fondos de post, energía, urgencia |
| Morado | `#64327E` | Contraste principal — mentorías, cierres, texto sobre fondos claros |
| Morado claro | `#885E94` | Sombras, ilustración lineal, fondos secundarios |
| Amarillo | `#EFB72F` | Acento — resaltado tipo marcador, iconografía. Nunca como fondo de texto extenso |
| Arena | `#F3E7D8` | Papel base — texto sobre color saturado, fondo neutro |
| Tinta (texto) | `#3B1E45` | Color de texto principal sobre fondos claros |

Combinaciones habituales: texto Arena sobre Rojo/Morado; texto Tinta sobre Arena/Amarillo.

### Typography
- **Aileron** (sans-serif, via `@fontsource/aileron` — weights 400/600/700 loaded): titulares informativos, cuerpo de texto, datos (fechas, precios). Regular para párrafos, semibold/bold para énfasis. Note: Aileron does not ship a 900/black weight on fontsource — use 700 for the heaviest weight.
- **Newsreader** (serif editorial, italic, via Google Fonts — weights 500/600, italic): frases con carga emocional, citas, nombres de programas, fechas destacadas. Usar con moderación, en tamaños grandes.

### Spacing / shape
- Border radius: 4px on cards/images; 100px (pill) on buttons/nav/tags.
- Section padding: 56–120px vertical, 64px horizontal (desktop).
- Grain texture: subtle SVG fractal-noise overlay (`mix-blend-mode: multiply`, ~6% opacity) on all saturated color backgrounds — never on white.

## Assets
- `assets/logo-horizontal.svg` / `assets/logo-horizontal-purple.svg` — horizontal lockup (white / purple variants)
- `assets/logo-stacked.svg` / `assets/logo-stacked-purple.svg` — stacked/icon lockup (white / purple variants)
- `assets/ref-*.jpg` — reference photography (real creator portraits, warm natural light, colorful textiles, full-bleed crops with no frame/border)
- Logo symbol: the "u" forms a bridge arc (⌣) and the "n" an arch (⌢) — the letterform itself draws the link/bridge. Always used in a single flat color (white or arena) over saturated backgrounds.

## Files in this bundle

### `Puente - Guía de marca.dc.html`
Full brand guide: color palette, type specimens, logo usage (3 backgrounds), graphic elements (torn-star motif, marker-stroke highlight, grain texture), photography direction, voice/tone pillars (6: Autenticidad, Comunidad viva, Sensibilidad, Interculturalidad, Participación cultural, Interdisciplinareidad).

### `Puente - Plantillas Instagram.dc.html`
3 feed post templates at 1080×1350: (1) Cita/inspiración — red bg, torn-star motifs, stacked logo, photo slot; (2) Anuncio de taller — red bg, marker-highlight headline, event details (date/time/price with strikethrough); (3) Mentoría/programa — purple bg, "La emperatriz" wordmark with highlight, line-art icon.

### `Puente - Plantillas Stories.dc.html`
3 Story templates at 1080×1920: (1) Anuncio de taller with "swipe up" pill CTA; (2) Cita — full-bleed photo + italic serif quote; (3) Agradecimiento — repeated "¡Gracias!" headline over a diagonal-clipped photo panel.

### `Puente - La Emperatriz.dc.html`
Product landing page for the "La Emperatriz" cultural-project mentorship. Structure:
1. **Sticky pill nav** — logo + 3 anchor links + CTA button, floats centered at top on scroll.
2. **Hero** (purple bg, grain, torn-star decoration) — large bold headline ("Encamina tu") with a **typewriter-animated word** on its own line below (cycles through "proyecto" / "propósito" / "camino": types in ~90ms/char, holds 1.4s, deletes ~45ms/char, then advances), followed by "cultural.", a subhead, CTA button, and a full-width photo slot.
3. **"Para quién" scroll-reveal** — 3 paragraphs that fade from 28% to 100% opacity via `IntersectionObserver` as they cross into view (threshold 0.5).
4. **"Cómo trabajamos"** — horizontally scrollable card row (`scroll-snap-type: x mandatory`, 340px cards) with a 3-dot progress indicator above that highlights the active card based on scroll position.
5. **Cita destacada** — full-bleed red section, centered italic serif pull-quote.
6. **"Para quién es"** — photo + copy + pill tag list.
7. **FAQ accordion** (dark ink bg) — 4 questions, click toggles open/closed, only one open at a time, +/− icon swaps and active question turns yellow.
8. **CTA final** — purple section, headline + button.
9. **Footer** — small logo + giant low-opacity email watermark text.

## Interactions & Behavior detail
- Typewriter effect and scroll-reveal are implemented via component state + `IntersectionObserver`/`setInterval` — see the file's logic class for exact timings.
- Horizontal card scroll: dot index computed as `Math.round(scrollLeft / 364)`.
- FAQ: single-open accordion, index stored in state, default first item open.

## Notes for the developer
- No component library was used — everything is inline-styled HTML/CSS in single-file prototypes. Recreate using the target codebase's actual component/styling conventions (Tailwind, CSS-in-JS, native, etc.), not by embedding this HTML.
- Image placeholders (`<image-slot>`) mark where real photography should go — replace with actual `<img>`/asset pipeline in production.
- Reference architecture (sticky pill nav, big animated headline, horizontal snap-scroll cards with dot indicator, dark FAQ accordion, giant watermark footer text) was adapted from a client-provided reference video of umanodesign.studio's interaction patterns — colors, type, copy, and logo are 100% Puente's own.
