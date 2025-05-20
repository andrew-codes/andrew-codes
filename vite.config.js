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
  ssr: {
    noExternal: [
      "@mui/*", // fix material-ui ES modules imported error.
    ],
  },
  optimizeDeps: {
    include: ['@mui/*'],
  },
})
