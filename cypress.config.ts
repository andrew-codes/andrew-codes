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
    // navigation.cy.ts's forward/back transitions fetch multi-megabyte
    // *.data payloads (every post's fully bundled MDX); on a
    // resource-constrained CI runner that occasionally exceeds even the
    // generous per-assertion timeouts set on those tests. Retrying only in
    // `cypress run` (CI) absorbs that runner-load variance without masking
    // real regressions locally, where `cypress open` still fails immediately.
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  video: false,
})
