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
      serverDependenciesToBundle: [/.*(!?(esbuild))/],
    }),
    // metronome({
    //   debug: process.env.NODE_ENV !== "production",
    //   ignoredRoutes: [],
    //   ignoredPathnames: ["/healthcheck"],
    //   ignoreHeadMethod: true,
    // }),
  ],
})
