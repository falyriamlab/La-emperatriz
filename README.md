# La Emperatriz — Landing de venta

Landing page de conversión para "La Emperatriz", mentoría cultural de Puente (consultora de gestión cultural). Objetivo: llevar a checkout de Stripe. Next.js (App Router) + TypeScript + Tailwind CSS v4.

## Design system

Tokens de marca definidos como CSS custom properties en [`app/globals.css`](./app/globals.css) y expuestos a Tailwind vía `@theme inline` — usar las utilidades (`bg-coral`, `text-morado-oscuro`, etc.), no hex hardcodeado en componentes.

| Token | Hex | Uso |
|---|---|---|
| `morado-oscuro` | `#6B398C` | Primario — texto/fondos fuertes |
| `lila` | `#8F69A1` | Secundario |
| `crema` | `#F3EADC` | Fondo base |
| `amarillo` | `#ECBF04` | Acento, CTAs secundarios |
| `coral` | `#E22E49` | CTA primario, urgencia |
| `negro` | `#1a1a1a` | Contraste puntual |

Tipografía: [Manrope](https://fonts.google.com/specimen/Manrope) vía `next/font/google` (geométrica/bold, fallback a Aileron).

> Nota: este proyecto reemplaza un scaffold Vite+React anterior basado en `design_handoff_puente_ds/` (paleta distinta). Ese handoff sigue siendo referencia de marca válida para tono/voz, pero los tokens de color activos son los de arriba, dados directamente para esta landing.

## Estructura

```
app/
  layout.tsx      fuente, metadata, colores base
  page.tsx        ensambla las secciones
  globals.css     tokens de color + Tailwind theme
components/
  CTAButton.tsx       botón reutilizable (variant: primary | secondary)
  sections/           una sección de la landing por archivo (Hero, Pain, WhatIs, ...)
```

## Comandos

```
npm run dev      # servidor de desarrollo (Turbopack)
npm run build    # type-check + build de producción
npm run lint     # eslint
```
