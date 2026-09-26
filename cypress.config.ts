import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4173",
    supportFile: "cypress/support/e2e.ts",
    // Client-side route transitions lazy-load a JS chunk per route (see
    // cypress/support/e2e.ts for the related hydration note). On
    // resource-constrained CI runners that fetch can take longer than
    // Cypress's 4000ms default, so location/content assertions immediately
    // after a navigating click need more headroom than local runs do.
    defaultCommandTimeout: 10000,
  },
  video: false,
})
