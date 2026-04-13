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
    noExternal: true,
  },
  optimizeDeps: {
    include: ["@mui/*"],
  },
})
