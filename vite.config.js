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
