import { type RequestHandler } from "express"
import * as pathToRegExpImport from "path-to-regexp"

const { compile, match, parse } = pathToRegExpImport

function typedBoolean<T>(
  value: T,
): value is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(value)
}

function getRedirectsMiddleware({
  redirectsString,
}: {
  redirectsString: string
}): RequestHandler {
  const possibleMethods = ["HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "*"]
  const redirects = redirectsString
    .split("\n")
    .map((line, lineNumber) => {
      if (!line.trim() || line.startsWith("#")) return null

      let methods, from, to
      const [one, two, three] = line
        .split(" ")
        .map((l) => l.trim())
        .filter(Boolean)
      if (!one) return null

      const splitOne = one.split(",")
      if (possibleMethods.some((m) => splitOne.includes(m))) {
        methods = splitOne
        from = two
        to = three
      } else {
        methods = ["*"]
        from = one
        to = two
      }

      if (!from || !to) {
        console.error(`Invalid redirect on line ${lineNumber + 1}: "${line}"`)
        return null
      }
      const keys: Array<pathToRegExpImport.Key> = []

      const toUrl = to.includes("//")
        ? new URL(to)
        : new URL(`https://same_host${to}`)
      try {
        return {
          methods,
          from: match(from),
          keys,
          toUrl,
        }
      } catch (error: unknown) {
        // if parsing the redirect fails, we'll warn, but we won't crash
        console.error(
          `Failed to parse redirect on line ${lineNumber}: "${line}"`,
        )
        console.error(error)
        return null
      }
    })
    .filter(typedBoolean)

  return function redirectsMiddleware(req, res, next) {
    const host = req.header("X-Forwarded-Host") ?? req.header("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    let reqUrl
    try {
      reqUrl = new URL(`${protocol}://${host}${req.url}`)
    } catch (error: unknown) {
      console.error(`Invalid URL: ${protocol}://${host}${req.url}`)
      next()
      return
    }
    for (const redirect of redirects) {
      try {
        if (
          !redirect.methods.includes("*") &&
          !redirect.methods.includes(req.method)
        ) {
          continue
        }
        const matched = redirect.from(req.url)
        if (!matched) continue

        const params: Record<string, string> = {}
        const paramValues = matched.params
        for (
          let paramIndex = 0;
          paramIndex < paramValues.length;
          paramIndex++
        ) {
          const paramValue = paramValues[paramIndex]
          const key = redirect.keys[paramIndex]
          if (key && paramValue) {
            params[key.name] = paramValue
          }
        }
        const toUrl = new URL(redirect.toUrl)

        toUrl.protocol = protocol
        if (toUrl.host === "same_host") toUrl.host = reqUrl.host

        for (const [key, value] of reqUrl.searchParams.entries()) {
          toUrl.searchParams.append(key, value)
        }
        res.redirect(307, toUrl.toString())
        return
      } catch (error: unknown) {
        // an error in the redirect shouldn't stop the request from going through
        console.error(`Error processing redirects:`, {
          error,
          redirect,
          "req.url": req.url,
        })
      }
    }
    next()
  }
}

export { getRedirectsMiddleware }
