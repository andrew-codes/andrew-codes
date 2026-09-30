import { expect } from "vitest"

// Privacy allowlist patterns shared by every test that scans generated output:
// the machine layer must never expose an email address, phone number or street
// address.

export const FORBIDDEN: Record<string, RegExp> = {
  email: /[^\s@"'<>()[\]]+@[^\s@"'<>()[\]]+\.[a-z]{2,}/i,
  "mailto/tel link": /\b(mailto|tel):/i,
  // Not an ISO date (2026-01-01), which structured data carries.
  phone: /(?<![\d-])(?!\d{4}-\d{2}-\d{2}(?!\d))\+?\d[\d\s().-]{8,}\d/,
  "street address": /\b\d{1,6}\s+(?:[A-Z][\w.]*\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Parkway|Pkwy)\b\.?/,
  "zip code": /\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/,
}

export const scan = (label: string, text: string) => {
  const hits = Object.entries(FORBIDDEN).flatMap(([kind, pattern]) => {
    const match = text.match(pattern)
    return match ? [`${label}: ${kind} "${match[0]}"`] : []
  })
  expect(hits).toEqual([])
}
