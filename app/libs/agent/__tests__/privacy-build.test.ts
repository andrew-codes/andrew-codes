import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { formatViolations, scanBuildDir } from "../privacy-scan"

// Scans the real build output when one exists (after `yarn build`). The
// Cypress suite runs the same scan unconditionally in CI after building.
const buildDir = join(__dirname, "../../../../build/client")

describe.skipIf(!existsSync(buildDir))("built artifacts", () => {
  it("expose no email, phone, address or resume PDF reference", () => {
    const { scanned, violations } = scanBuildDir(buildDir)
    expect(scanned.length).toBeGreaterThan(0)
    expect(formatViolations(violations)).toEqual([])
  })
})
