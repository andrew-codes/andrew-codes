import { existsSync } from "node:fs"
import { defineConfig } from "cypress"
import { formatViolations, scanBuildDir } from "./app/libs/agent/privacy-scan"

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        // Scans the build output on disk (discovered by extension) for
        // contact details. See cypress/e2e/privacy.cy.ts.
        scanBuildForPrivacy(dir: string) {
          // The Cloudflare preview job has no local build to read.
          if (!existsSync(dir)) return null
          const { scanned, violations } = scanBuildDir(dir)
          return { scanned, violations: formatViolations(violations) }
        },
      })
    },
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
    // CYPRESS_BASE_URL can point this suite at a real deployed Cloudflare
    // preview instead of localhost (see .github/workflows/ci.yml's
    // "Cloudflare preview" job). Cypress's cy.wait('@alias') first waits up
    // to requestTimeout (default 5000ms) for the intercepted request to even
    // be dispatched, before it waits up to responseTimeout for the response.
    // Against a live edge deployment, public-internet latency plus hydration
    // can push the click-to-fetch gap past that 5000ms default in a way
    // loopback-only localhost runs never hit, so cy.wait() reports "No
    // request ever occurred" even though the request does eventually fire.
    // Raise both to match the headroom already given to defaultCommandTimeout.
    requestTimeout: 15000,
    responseTimeout: 30000,
  },
  video: false,
})
