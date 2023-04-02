/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    unstabel_dev: true,
  },
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [/.*/],
  ignoredRouteFiles: ["**/.*"],
}
