import type { NextConfig } from "next";

// GitHub Pages serves static files with no image-optimization server and,
// for a project site (not a custom domain), from a /<repo-name> subpath —
// both require build-time config, not something togglable at runtime.
// NEXT_PUBLIC_BASE_PATH is set in .github/workflows/deploy.yml; local dev
// and `npm run build` leave it unset, so basePath stays "" and the site
// keeps living at the root like before. See lib/basePath.ts for the
// matching runtime constant used to prefix hardcoded next/image src paths.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    // No Next.js image server on static hosting — ship the originals as-is.
    unoptimized: true,
    // Decorative brand SVGs in public/elements/ are served through next/image.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
