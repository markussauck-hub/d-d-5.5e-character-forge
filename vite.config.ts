// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages build (only used by .github/workflows/pages.yml).
// Lovable's own preview/publish never sets GITHUB_PAGES, so this branch is inert there.
// It produces a static single-page app (no SSR server) under the repo sub-path.
const pagesBase = process.env["GITHUB_PAGES_BASE"]; // e.g. "/d-d-5.5e-character-forge/"
const isPages = !!process.env["GITHUB_PAGES"];

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isPages && {
      spa: { enabled: true, prerender: { outputPath: "/index.html", crawlLinks: false } },
    }),
  },
  ...(isPages && {
    nitro: false,
    vite: { base: pagesBase ?? "/" },
  }),
});
