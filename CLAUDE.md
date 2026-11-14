# CLAUDE.md — La Emperatriz (Puente)

Contexto permanente para trabajar en este repositorio. Léelo completo al empezar cada sesión.
Este repositorio puede ser público: no añadas aquí claves, contraseñas ni URLs privadas.

## Cómo trabajar con Val

- Habla en español. Val es la diseñadora visual de Puente, lidera el desarrollo web y tiene formación en QA.
- Actúa a la vez como diseñador UX/UI senior, ingeniero de QA y desarrollador.
- Trabaja paso a paso. Si la tarea es grande o ambigua, propone un plan corto y espera su visto bueno antes de cambiar código. No le des muchas instrucciones a la vez: se pierde.
- Sé honesto y preciso: compara opciones con datos. Si algo choca con una decisión de negocio o tiene riesgo (ventas, legal, accesibilidad, datos personales), dilo antes de hacerlo.
- Las decisiones de negocio (precios, promesas, textos legales, políticas) son de Daniela. No las inventes: propón un texto y márcalo como pendiente de su aprobación.
- Al terminar cada tarea entrega: resumen corto de lo que cambió, tabla de QA (pasa/no pasa), commits y `git status`. Explica cualquier cosa que hayas hecho sin que se pidiera.
- Lo que Val tenga que hacer fuera del código (GitHub, Google, Stripe), explícalo en pasos numerados con los nombres exactos de los botones. Si hay que escribirle a Daniela, redacta el mensaje listo para copiar, en lenguaje no técnico.

## El proyecto

- Landing de venta de **La Emperatriz** (PT: **A Imperatriz**), mentoría individual de 4 meses de **Puente Consultora Cultural** para creadoras culturales iberoamericanas.
- Producción: https://laemperatriz-somospuentecultural.com (GitHub Pages con dominio propio).
- Repositorio: `falyriamlab/La-emperatriz`.
- Páginas: `/` (landing), `/masterclass` (creada por Juan Pablo, `noindex`), `/condiciones`, `/privacidad`, `/aviso-legal`.

### Personas
- **Daniela Betancourt**: fundadora y CEO de Puente. Decide producto, precios y textos legales. Correo público: hola@somospuentecultural.com.
- **Val**: diseño y desarrollo web.
- **Juan Pablo Hernandez**: colaborador; creó `/masterclass`. Avisa antes de tocar su página y haz cambios mínimos.

## Stack y arquitectura

- Next.js (App Router) + TypeScript + Tailwind v4, con `output: 'export'` (sitio estático). Sin API routes ni server actions: todo envío es `fetch` desde el navegador.
- **Despliegue**: `.github/workflows/deploy.yml`, solo con push a `main` (lanzado a mano desde otra rama queda omitido). La variable de repositorio `NEXT_PUBLIC_LEADS_ENDPOINT` (pestaña *Variables*, no *Secrets*) se inserta al compilar: si cambia, hay que volver a desplegar.
- **`main` está protegida** (ruleset): solo por Pull Request, 0 aprobaciones, sin force push ni borrado.
- **Push**: desde Claude Code a veces falla la autenticación de GitHub. Si pasa, pídele a Val que suba la rama desde la terminal de VS Code (`git push -u origin <rama>`) y que haga el Pull Request.
- **Idiomas**: `lib/i18n/es.json` y `lib/i18n/pt.json` con `LanguageContext`. El cambio de idioma no cambia la URL; la preferencia se guarda en `localStorage` (`puente-lang`) y el primer render es siempre ES. El portugués es de Brasil.
- **Precios**: `lib/pricing.ts` (precios, suma mensual y ahorro calculados, links de Stripe). Nunca escribas importes derivados a mano.
- **Formularios**:
  - `ContactForm` vive en un modal (`ContactModal`). Todos los enlaces "Agendar sesión semilla" abren el modal en modo semilla; tras enviar aparece el botón "Elegir día y hora" al calendario de Google. Sin JavaScript, con `no-hydrate` o sin endpoint, el enlace va directo al calendario.
  - `MasterclassForm` en `/masterclass` (pasos con indicador y comunidad abierta de WhatsApp).
  - Envío en `lib/leads.ts` hacia un Google Apps Script, como `text/plain` (Apps Script no responde al preflight CORS).
  - `lib/features.ts`: `FORMS_READY = isDev || endpoint`.
  - Avisos de privacidad por capas (`PrivacyInfo` en `components/form/fields.tsx`): línea corta visible y texto completo en `<details>`.
- **Apps Script** (`integrations/apps-script/`, con README y pruebas):
  - Script vinculado a la hoja "Leads Puente" (cuenta de Daniela). Pestañas `Leads` y `Masterclass`; el script crea los encabezados si la pestaña está vacía.
  - `@OnlyCurrentDoc`, `NOTIFY_EMAIL` = hola@ (los avisos llegan, comprobado), máximo 20 avisos por hora, apóstrofo anti-fórmula, `LockService`.
  - `REQUIRED` debe coincidir con `FIELD_REQUIRED` del formulario. Regla: el servidor nunca es más estricto que el formulario.
  - Si cambias `Code.gs`: corre sus pruebas (ver README) y dile a Val que lo pegue en Apps Script y publique desde *Implementar → Gestionar implementaciones → lápiz → Nueva versión*, para conservar la URL.
- **Textos legales**: Markdown en `content/legal/{es,pt}/` (condiciones, privacidad, aviso-legal), renderizados en el build con `lib/markdown.ts` (parser propio). URLs en `lib/legal.ts`.
- **Tipografía**: `lib/typography.ts`. Todos los h2 de sección en la serif de la marca en itálica (36 px escritorio, 30 px móvil). Excepciones a propósito: el título del cierre (`CLOSING_TITLE_CLASS`, 48 px en escritorio) y el h1 del Hero, que mezcla serif y sans.
- **Foco**: `FOCUS_RING` (morado, fondos claros) y `FOCUS_RING_ON_DARK` (crema, fondos morados) en `components/form/fields.tsx`. No uses el anillo nativo del navegador.
- **Animaciones**: estados ocultos con la variante Tailwind `js:` (`.js:not(.no-hydrate)`). Red de seguridad `no-hydrate` a los 4 s en el script del `<head>` de `app/layout.tsx`. `prefers-reduced-motion` se lee con `useSyncExternalStore`, nunca durante el render.
- **Imágenes**: foto de Daniela en WebP 1x/2x con `srcset`; SVG decorativos optimizados con SVGO (`svgo.config.mjs`); los logos se dejan sin optimizar. Logo del header con carga inmediata; el resto, `lazy`.
- **Botones**: `CTAButton` (barrido de color y flechas, prop `surface` light/dark, puede ser enlace o `<button>`). No cambies su border-radius.
- **Fondos**: nunca dos secciones seguidas con el mismo fondo (alternan morado, lila claro, crema y crema claro).

## Marca

- Colores: morado `#6B398C`, lila `#8F69A1`, crema `#F3EADC`, amarillo `#ECBF04`, coral `#E22E49`, error `#b3132e`. Usa los tokens, nunca hex sueltos.
- Tipografías: Aileron (cuerpo e interfaz) y la serif de la marca en itálica para títulos.
- Ilustraciones de marca en `public/elements/` (estrellas, sello, manos, galaxia), estilo grabado.
- Tono: cercano, sensible, inclusivo, de "tú" y en femenino genérico ("creadoras").

## Reglas obligatorias

1. Todo texto nuevo o modificado va en `es.json` y `pt.json` a la vez. Nada de textos escritos a mano en componentes.
2. Accesibilidad WCAG AA: contraste 4,5:1 (3:1 en texto grande y controles), foco visible, áreas táctiles de al menos 44 px, `prefers-reduced-motion`, sin desbordamiento de 320 a 1920 px, y la página debe verse sin JavaScript.
3. Excepciones de contraste aceptadas por Daniela: texto crema sobre botones coral y números amarillos sobre tarjetas claras. No las cambies si no te lo piden. Las flechas desactivadas del carrusel están exentas.
4. Mide el contraste convirtiendo los colores calculados a sRGB (Tailwind v4 usa `oklab`) y componiendo las capas transparentes. Deja margen: evita valores justo en el límite.
5. QA con Playwright antes de dar algo por terminado: ES y PT, 320/375/768/1280 px, sin errores de consola ni de hidratación, y `next build`. Si el cambio no debería alterar el aspecto, haz comparación visual antes/después.
6. En pruebas, bloquea `script.google.com`: cero envíos reales a la hoja.
7. Git: una rama nueva desde `main` actualizada por tarea, y commits pequeños. No hagas push ni merge sin permiso de Val. Al final, dile qué archivos deben aparecer en *Files changed* del Pull Request.
8. No instales dependencias sin permiso.
9. `.env.local` no se versiona. No pongas claves ni URLs privadas en el repositorio.
10. No reescribas los textos de `content/legal/`: cualquier cambio necesita aprobación de Daniela, en español y portugués.

## Decisiones de negocio vigentes

- **Precio**: inversión mensual 155 €/mes, sin permanencia (se deja escribiendo antes de la siguiente factura); inversión total 555 € (se muestra 620 € tachado y ahorro de 65 €). Mismo precio para todas; IVA incluido para residentes en la UE.
- **Sin urgencia inventada**: no hay cupos ni fechas de lanzamiento.
- **Acción principal**: pagar. "Comenzar mi proceso" lleva a `#inversion`. La sesión gratuita se llama **sesión semilla** (30 minutos) y pasa por el formulario.
- **Sesiones**: Google Meet, 1 h 30, 2 al mes, horarios flexibles. Grabación solo con consentimiento (carpeta de Drive, 1 año); si no, resumen escrito.
- **Garantía, desistimiento y fuerza mayor**: los detalla `content/legal/*/condiciones.md`.
- **Masterclass**: género y sector son obligatorios (para métricas).
- **Credenciales**: 9 años de experiencia; Puente forma parte de Madrid Emprende, donde Daniela es mentora. No se menciona "Colombia nos une".
- **Testimonios**: 5, en carrusel. No afirmes que hay permiso escrito de sus autoras: no está confirmado.

## Pendientes (actualizado al 14/11/2026)

1. Comprobar si la rama `fix/contraste` está publicada y si incluye el commit "nota y marca del cierre a crema/80".
2. Vista previa al compartir: Val diseña `og-emperatriz.png` y `og-masterclass.png` (1200×630, menos de 300 KB, sin fechas) para `public/og/`. Después: metadatos Open Graph y Twitter, `canonical` y `theme-color`.
3. Actualizar las acciones del workflow de despliegue por el aviso de Node 20.
4. Analítica: decide Daniela. Si se añade, hay que actualizar la política de privacidad (hoy dice que no hay analítica).
5. Tareas de Daniela: quitar a Val el acceso a la hoja y a las carpetas de grabaciones, y activar en Stripe la aceptación de condiciones en los dos links de pago.
6. Revisión legal de los tres textos y revisión del portugués por una persona nativa.
7. Avisar a Juan Pablo de los cambios de color en el indicador de pasos de `/masterclass`.
8. Opcional: en `/masterclass`, el país es texto libre; para contar por país convendría una lista como en el formulario de contacto.

Actualiza esta lista cuando cierres o descubras tareas, en el mismo Pull Request del cambio.
