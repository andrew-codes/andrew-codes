/** @type {import('@remix-run/dev').AppConfig} */
const { withEsbuildOverride } = require("remix-esbuild-override")
const styledComponentsPlugin = require("./styled-components-esbuild-plugin")

withEsbuildOverride((option) => {
  option.plugins.unshift(styledComponentsPlugin())

  return option
})

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

module.exports = config
