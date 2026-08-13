import { HeadersFunction } from "react-router"

function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host")
  if (!host) {
    throw new Error("Could not determine domain URL.")
  }
  const protocol = host.includes("localhost") ? "http" : "https"
  return `${protocol}://${host}`
}

function removeTrailingSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s
}

function typedBoolean<T>(
  value: T,
): value is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(value)
}

const tryFormatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
  locale: Intl.LocalesArgument = "en-us",
) => {
  try {
    // timeZone must be pinned to UTC (not left to the runtime default): this
    // is prerendered at build time on one machine and re-rendered again at
    // hydration time in the visitor's browser. Post dates are stored as
    // date-only strings (e.g. "2026-08-10"), which Date parses as UTC
    // midnight, so formatting in whatever the *local* timezone happens to be
    // gives a different calendar day on either side of that UTC instant.
    // Pinning to UTC makes the output identical everywhere, matching the
    // date the author actually wrote in the frontmatter.
    return new Date(dateString).toLocaleDateString(locale, {
      ...options,
      timeZone: "UTC",
    })
  } catch {
    return ""
  }
}

const useLoaderHeaders =
  (
    targetHeaders = ["Cache-Control", "Vary", "Server-Timing", "ETag"],
  ): HeadersFunction =>
  ({ loaderHeaders, parentHeaders }) => {
    const headers = new Headers()
    for (const headerName of targetHeaders) {
      if (loaderHeaders.has(headerName)) {
        headers.set(headerName, loaderHeaders.get(headerName)!)
      }
    }
    const appendHeaders = ["Server-Timing"]
    for (const headerName of appendHeaders) {
      if (parentHeaders.has(headerName)) {
        headers.append(headerName, parentHeaders.get(headerName)!)
      }
    }
    const useIfNotExistsHeaders = ["Cache-Control", "Vary"]
    for (const headerName of useIfNotExistsHeaders) {
      if (!headers.has(headerName) && parentHeaders.has(headerName)) {
        headers.set(headerName, parentHeaders.get(headerName)!)
      }
    }

    return headers
  }

export {
  tryFormatDate,
  getDomainUrl,
  removeTrailingSlash,
  typedBoolean,
  useLoaderHeaders,
}
