/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_meta: true,
  },
  appDirectory: "src/app",
  assetsBuildDirectory: "dist/public/build",
  publicPath: "/build/",
  serverBuildPath: "dist/build/index.js",
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [/.*(!?(esbuild))/],
  ignoredRouteFiles: ["**/.*"],
}
