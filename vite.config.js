import { vitePlugin as remix } from "@remix-run/dev"
import { metronome } from "metronome-sh/vite"
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
    metronome(),
  ],
})
