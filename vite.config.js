import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"

export default defineConfig({
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    reactRouter(),
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
