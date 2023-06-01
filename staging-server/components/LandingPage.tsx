import type { FC } from "react"
import type { StagedApp } from "staging-server/types"

const LandingPage: FC<{ apps: StagedApp[] }> = ({ apps }) => {
  return (
    <html>
      <head>
        <title>Staged PRs | Andrew.Codes</title>
      </head>
      <body>
        <div>
          <h1>Staged PRs</h1>
          <ul>
            {apps.map((app) => (
              <li key={app.prId}>
                <a
                  href={`https://github.com/andrew-codes/andrew-codes/pull/${app.prId}`}
                >
                  PR #{app.prId}
                </a>
                ,
                <a href={`https://staging.andrew.codes/${app.prId}/`}>
                  Staged app
                </a>
              </li>
            ))}
          </ul>
        </div>
      </body>
    </html>
  )
}

export default LandingPage
