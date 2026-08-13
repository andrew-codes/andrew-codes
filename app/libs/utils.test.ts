import { afterEach, describe, expect, it } from "vitest"
import { tryFormatDate } from "./utils"

// Regression test for a production hydration crash (React error #418) that
// kept reproducing on the deployed preview even after the charset fix for
// the same error code (see app/root.test.tsx).
//
// Root cause: tryFormatDate called `Date#toLocaleDateString` without a
// `timeZone`, so it used the *runtime's local timezone*. This function runs
// twice for every page: once at build time when the site is prerendered
// (on whatever timezone the build machine has - UTC on this repo's CI), and
// again in the browser when React hydrates (in the visitor's local
// timezone). Post dates are stored as date-only strings ("2026-08-10"),
// which `Date` parses as UTC midnight. Formatting that instant in a
// timezone behind UTC (nearly all of North/South America) rolls it back to
// the previous calendar day, so the client's re-render produces different
// text than what the server already sent - a hydration text mismatch.
//
// The fix pins formatting to `timeZone: "UTC"` so the output is the same
// wherever it runs, matching the calendar date actually written in the
// post's frontmatter.
describe("tryFormatDate", () => {
  const originalTz = process.env.TZ

  afterEach(() => {
    process.env.TZ = originalTz
  })

  it("formats a date-only string identically regardless of the runtime's local timezone", () => {
    process.env.TZ = "America/New_York"
    const behindUtc = tryFormatDate("2026-08-10")

    process.env.TZ = "Asia/Tokyo"
    const aheadOfUtc = tryFormatDate("2026-08-10")

    process.env.TZ = "UTC"
    const utc = tryFormatDate("2026-08-10")

    expect(behindUtc).toBe("8/10/2026")
    expect(aheadOfUtc).toBe("8/10/2026")
    expect(utc).toBe("8/10/2026")
  })

  it("does not let a caller override timeZone and reintroduce the mismatch", () => {
    process.env.TZ = "America/New_York"
    expect(
      tryFormatDate("2026-08-10", {
        month: "long",
        year: "numeric",
        timeZone: "America/New_York",
      }),
    ).toBe("August 2026")
  })
})
