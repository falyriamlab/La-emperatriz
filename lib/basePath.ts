// Must mirror `basePath` in next.config.ts exactly. GitHub Pages serves this
// project from a /<repo> subpath, and next/image's automatic basePath
// prefixing doesn't apply when images.unoptimized is true (static export has
// no image-optimization server) — so every hardcoded /public asset path
// passed straight to next/image needs it prepended by hand.
//
// NEXT_PUBLIC_ so the exact same literal value is inlined into both the
// server-rendered HTML and the client bundle at build time — a plain,
// unprefixed env var would read as "" in the browser and cause a hydration
// mismatch against the server-rendered src.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
