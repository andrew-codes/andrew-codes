import fs from "fs"
import { glob } from "glob"
import nodemon from "nodemon"

removeD2Assests().then(() => {
  nodemon({
    script: "index.ts",
    execMap: {
      js: "yarn node --import=@nitrogql/esbuild-register",
      ts: "yarn node --import=@nitrogql/esbuild-register",
    },
    ext: "ts tsx js jsx json env",
    watch: [
      "./index.ts",
      "./server/*.*",
      "./app/**/*.server.ts",
      "./app/**/server/*.ts",
      "./*.ts",
      "./app/posts/**/*.*",
    ],
    ignore: ["app/posts/**/d2/**/*.*"],
    env: {
      NODE_ENV: "development",
    },
  })
  nodemon.on("start", () => {})
  nodemon.on("quit", () => {
    console.log("Nodemon quit")
    process.exit()
  })
  nodemon.on("restart", (files) => {
    console.log("Nodemon restarted due to changes in:", files)
    removeD2Assests()
  })
})

function removeD2Assests() {
  console.info("Removing D2 assets...")
  return glob("app/posts/**/d2/*.png").then((files) => {
    files.forEach((file) => {
      fs.unlink(file, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file ${file}:`, unlinkErr)
        } else {
          console.log(`Deleted file: ${file}`)
        }
      })
    })
  })
}
