/** @type {import('@remix-run/dev').AppConfig} */
const { withEsbuildOverride } = require("remix-esbuild-override")
const styledComponentsPlugin = require("./styled-components-esbuild-plugin")

withEsbuildOverride((option) => {
  option.plugins.unshift(styledComponentsPlugin())

  return option
})

const { mountRoutes } = require("remix-mount-routes")
const basePath = process.env.PR_NUMBER ?? ""

module.exports = {
  future: {
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_meta: false,
  },
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [/.*(!?(esbuild))/],
  ignoredRouteFiles: ["**/.*"],
  publicPath: `/${basePath}/build/`,
  routes: (defineRoutes) => {
    const baseRoutes = mountRoutes(`/${basePath}`, "routes")
    const routes = {
      ...baseRoutes,
    }

    return routes
  },
}
