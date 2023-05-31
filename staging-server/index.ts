import express from "express"
import "express-async-errors"

const run = async () => {
  const app = express()

  app.use("/healthcheck", (req, res) => res.status(200).send("OK"))

  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack)
    res.status(500).send("Error")
  })

  const port = process.env.PORT ?? 3000
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
  })
}

if (require.main !== module) {
  run()
}
export default run
