import { vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"

export default defineConfig({
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      serverDependenciesToBundle: [/.*(!?(esbuild))/],
    }),
  ],
  ssr: {
    noExternal: [
      "@mui/*", // fix material-ui ES modules imported error.
      "posthog-js",
      "posthog-js/react",
    ],
  },
  optimizeDeps: {
    include: ["@mui/*"],
  },
})
