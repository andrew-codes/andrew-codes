const express = require("express")

const run = async () => {
  const app = express()

  app.use("/healthcheck", (req, res) => res.status(200).send("OK"))

  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Error")
  })

  const port = process.env.PORT ?? 3001
  app.listen(port, () => {
    console.log(`Staging express server listening on port ${port}`)
  })
}

run()
