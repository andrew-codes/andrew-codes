import { expect } from "vitest"
import { scanText } from "../privacy-scan"

// Shared by every test that scans generated output: the machine layer must
// never expose an email address, phone number or street address. The patterns
// live in ../privacy-scan so the build-directory gate and these tests agree.

export const scan = (label: string, text: string) => {
  expect(scanText(label, text).map((v) => `${label}: ${v.kind} "${v.match}"`)).toEqual([])
}
