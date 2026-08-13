import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// Deliberately separate from vite.config.js: that config's `reactRouter()`
// plugin expects to run inside the React Router dev/build pipeline (virtual
// route modules, etc.), which isn't relevant for unit tests that import
// components directly.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["app/**/*.test.{ts,tsx}"],
  },
})
