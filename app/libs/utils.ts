import { HeadersFunction } from "@remix-run/node"

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
    return new Date(dateString).toLocaleDateString(locale, options)
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
