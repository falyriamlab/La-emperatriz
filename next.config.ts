import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Decorative brand SVGs in public/elements/ are served through next/image.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
