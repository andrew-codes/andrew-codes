module.exports = {
  apps: [
    {
      name: "Server",
      script: "index.js",
      interpreter_args:
        "--require ./.pnp.cjs --require esbuild-register --inspect",
      watch: [
        "./index.js",
        "./server/**/*.ts",
        "./.env",
        "config/app/**",
        "config/pm2.config.js",
      ],
      env: {
        NODE_ENV: process.env.NODE_ENV ?? "development",
        FORCE_COLOR: "1",
      },
    },
    {
      name: "Remix",
      script: "app.start.remix.dev.js",
      interpreter_args:
        "--require ./.pnp.cjs --require esbuild-register --inspect",
      ignore_watch: ["."],
      env: {
        NODE_ENV: process.env.NODE_ENV ?? "development",
        FORCE_COLOR: "1",
      },
    },
  ],
}
