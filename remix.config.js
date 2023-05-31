/** @type {import('@remix-run/dev').AppConfig} */
const { withEsbuildOverride } = require("remix-esbuild-override")
const styledComponentsPlugin = require("./styled-components-esbuild-plugin")
const mountRoutes = require("remix-mount-routes")

withEsbuildOverride((option) => {
  option.plugins.unshift(styledComponentsPlugin())

  return option
})

const deploymentEnv = process.env.DEPLOYMENT_ENV ?? "production"
const prNumber = process.env.PR_NUMBER ?? null
const config = {
  future: {
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_meta: true,
  },
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [/.*(!?(esbuild))/],
  ignoredRouteFiles: ["**/.*"],
}

if (deploymentEnv === "staging" && !prNumber) {
  config.routes = (defineRoutes) => {
    return mountRoutes(`${prNumber}`, "routes")
  }
  config.publicPath = `${prNumber}/build`
}

module.exports = config
