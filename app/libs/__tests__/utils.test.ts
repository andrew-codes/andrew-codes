import { afterEach, describe, expect, it } from "vitest"
import { getDomainUrl, removeTrailingSlash, toIsoDate, tryFormatDate, typedBoolean, useLoaderHeaders } from "../utils"

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

describe("getDomainUrl", () => {
  it("prefers X-Forwarded-Host over the host header", () => {
    const request = new Request("http://example.com", {
      headers: { host: "internal.local", "X-Forwarded-Host": "andrew.codes" },
    })

    expect(getDomainUrl(request)).toBe("https://andrew.codes")
  })

  it("falls back to the host header when X-Forwarded-Host is absent", () => {
    const request = new Request("http://example.com", {
      headers: { host: "andrew.codes" },
    })

    expect(getDomainUrl(request)).toBe("https://andrew.codes")
  })

  it("uses http for localhost", () => {
    const request = new Request("http://example.com", {
      headers: { host: "localhost:5173" },
    })

    expect(getDomainUrl(request)).toBe("http://localhost:5173")
  })

  it("throws when no host can be determined", () => {
    const request = new Request("http://example.com")

    expect(() => getDomainUrl(request)).toThrow("Could not determine domain URL.")
  })
})

describe("removeTrailingSlash", () => {
  it("removes a single trailing slash", () => {
    expect(removeTrailingSlash("/posts/")).toBe("/posts")
  })

  it("leaves a string with no trailing slash unchanged", () => {
    expect(removeTrailingSlash("/posts")).toBe("/posts")
  })
})

describe("typedBoolean", () => {
  it("narrows out falsy values", () => {
    const values: Array<string | undefined | null | 0 | false> = ["a", "", 0, false, null, undefined, "b"]

    expect(values.filter(typedBoolean)).toEqual(["a", "b"])
  })
})

describe("useLoaderHeaders", () => {
  it("copies default target headers from the loader response", () => {
    const headersFn = useLoaderHeaders()
    const loaderHeaders = new Headers({ "Cache-Control": "max-age=60", ETag: "abc123" })
    const parentHeaders = new Headers()

    const result = new Headers(headersFn({ loaderHeaders, parentHeaders } as any))

    expect(result.get("Cache-Control")).toBe("max-age=60")
    expect(result.get("ETag")).toBe("abc123")
  })

  it("appends Server-Timing from the parent instead of overwriting it", () => {
    const headersFn = useLoaderHeaders()
    const loaderHeaders = new Headers({ "Server-Timing": "loader;dur=10" })
    const parentHeaders = new Headers({ "Server-Timing": "parent;dur=5" })

    const result = new Headers(headersFn({ loaderHeaders, parentHeaders } as any))

    expect(result.get("Server-Timing")).toBe("loader;dur=10, parent;dur=5")
  })

  it("only uses a parent header when the loader didn't already set it", () => {
    const headersFn = useLoaderHeaders()
    const loaderHeaders = new Headers({ "Cache-Control": "max-age=60" })
    const parentHeaders = new Headers({ "Cache-Control": "max-age=0", Vary: "Accept" })

    const result = new Headers(headersFn({ loaderHeaders, parentHeaders } as any))

    expect(result.get("Cache-Control")).toBe("max-age=60")
    expect(result.get("Vary")).toBe("Accept")
  })
})

describe("toIsoDate", () => {
  it("returns a YYYY-MM-DD string, not a locale-formatted one", () => {
    expect(toIsoDate("2024-09-18")).toBe("2024-09-18")
  })

  it("accepts the Date objects YAML front matter parses into", () => {
    expect(toIsoDate(new Date("2023-05-19"))).toBe("2023-05-19")
  })

  it("is independent of the runtime's local timezone", () => {
    const originalTz = process.env.TZ
    try {
      process.env.TZ = "America/Los_Angeles"
      expect(toIsoDate("2024-01-01")).toBe("2024-01-01")
      process.env.TZ = "Pacific/Auckland"
      expect(toIsoDate("2024-01-01")).toBe("2024-01-01")
    } finally {
      process.env.TZ = originalTz
    }
  })

  it("returns undefined for a missing or invalid date", () => {
    expect(toIsoDate(undefined)).toBeUndefined()
    expect(toIsoDate(null)).toBeUndefined()
    expect(toIsoDate("not a date")).toBeUndefined()
  })
})
