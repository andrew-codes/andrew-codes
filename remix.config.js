/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_meta: true,
  },
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [/.*/],
  ignoredRouteFiles: ["**/.*"],
}
