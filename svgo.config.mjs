// SVGO for the brand SVGs in public/ (run: npx svgo --config svgo.config.mjs -r public/elements public/logo).
// Safe settings: geometry and colors stay as drawn. SVGO 4's preset-default
// no longer removes the viewBox, so the SVGs keep scaling with CSS.
export default {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Keep colors exactly as written (no #ffffff → #fff, no named colors).
          convertColors: false,
          // Don't merge shapes into one path: overlapping paths with opacity would change.
          mergePaths: false,
        },
      },
    },
  ],
};
