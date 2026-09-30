import { readdirSync, readFileSync, statSync } from "node:fs"
import { extname, join, relative } from "node:path"

// Privacy gate shared by the Vitest suite and the Cypress e2e task. It walks a
// build directory and scans every text artifact for contact details that the
// site must never expose: email addresses, mailto/tel links, phone numbers and
// street addresses. Artifacts are found by extension so anything a later task
// adds to the build output is covered without a hand-kept list.

export const FORBIDDEN: Record<string, RegExp> = {
  email: /[^\s@"'<>()[\]\\]+@[^\s@"'<>()[\]\\]+\.[a-z]{2,}/i,
  "mailto/tel link": /\b(mailto|tel):/i,
  // Grouped NANP numbers ("470 535 9093", "(470) 535-9093", "+1.470.535.9093")
  // and any "+"-prefixed international number. A bare run of digits is not
  // flagged: built HTML and serialised data are full of timestamps, SVG path
  // data and byte counts that look identical. tel: links cover that form.
  phone: /(?<![\w.+-])(?:\+\d{1,3}[\s.-]?)?(?:\(\d{3}\)[\s.-]?|\d{3}[\s.-])\d{3}[\s.-]\d{4}(?![\w-])|(?<![\w.])\+\d{1,3}(?:[\s.-]?\(?\d{1,4}\)?){2,5}(?!\w)/,
  "street address": /\b\d{1,6}\s+(?:[A-Z][\w.]*\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Parkway|Pkwy)\b\.?/,
  "zip code": /\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/,
}

// The resume PDF keeps its contact header and stays published, so no
// machine-facing output may link to it or read from it.
export const PDF_REFERENCE = /\.pdf\b|\.pdf(?=[%"'\s)])|Resume\.pdf/i

// Text formats the build emits. Binary assets (images, fonts, the PDF) and
// code bundles (js, css) are left out: bundles are minified code, not content.
export const TEXT_EXTENSIONS = new Set([".html", ".json", ".xml", ".txt", ".md", ".data", ".webmanifest", ".csv"])
// Files with no extension that are still published text.
export const TEXT_FILENAMES = new Set(["_headers", "_redirects"])

// Third-party contact details that ship inside vendored font licences. They
// are not the site owner's, so each is allowed by exact file and match.
export const ALLOWED: ReadonlyArray<{ file: string; match: string }> = [{ file: "fonts/OFL.txt", match: "team@latofonts.com" }]

export type Violation = { file: string; kind: string; match: string }

export const discoverArtifacts = (dir: string): string[] => {
  const found: string[] = []
  const walk = (current: string) => {
    for (const entry of readdirSync(current)) {
      const path = join(current, entry)
      if (statSync(path).isDirectory()) {
        walk(path)
      } else if (TEXT_EXTENSIONS.has(extname(entry).toLowerCase()) || TEXT_FILENAMES.has(entry)) {
        found.push(path)
      }
    }
  }
  walk(dir)
  return found.sort()
}

// Dates are masked first: feeds and indexes carry ISO dates that the phone
// pattern would otherwise read as a number.
const maskDates = (text: string) => text.replace(/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?\b/g, "DATE")

// Whole files are scanned, including <script> JSON-LD blocks and attributes.
export const scanText = (file: string, text: string): Violation[] => {
  const masked = maskDates(text)
  return Object.entries(FORBIDDEN).flatMap(([kind, pattern]) => {
    const match = masked.match(pattern)
    const allowed = match && ALLOWED.some((entry) => entry.file === file && entry.match === match[0])
    return match && !allowed ? [{ file, kind, match: match[0] }] : []
  })
}

// Machine-facing outputs are everything that is not a rendered HTML page.
// Pages may mention the PDF to visitors; agent feeds and markdown may not.
const isMachineFacing = (file: string) => !file.endsWith(".html") && !file.endsWith(".data")

export const scanBuildDir = (dir: string): { scanned: string[]; violations: Violation[] } => {
  const scanned = discoverArtifacts(dir)
  const violations = scanned.flatMap((path) => {
    const file = relative(dir, path)
    const text = readFileSync(path, "utf8")
    const found = scanText(file, text)
    const pdf = isMachineFacing(file) ? text.match(PDF_REFERENCE) : null
    return pdf ? [...found, { file, kind: "resume PDF reference", match: pdf[0] }] : found
  })
  return { scanned, violations }
}

export const formatViolations = (violations: Violation[]) => violations.map((v) => `${v.file}: ${v.kind} "${v.match}"`)
