import * as React from "react"
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
          <table>
            <thead>
              <tr>
                <th>PR ID</th>
                <th>PR Name</th>
                <th>Staged App Link</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.prId}>
                  <td>
                    <a
                      href={`https://github.com/andrew-codes/andrew-codes/pull/${app.prId}`}
                    >
                      #{app.prId}
                    </a>
                  </td>
                  <td>{app.name}</td>
                  <td>
                    <a href={`https://staging.andrew.codes/${app.prId}/`}>
                      Staged app
                    </a>
                  </td>
                  <td>{app.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  )
}

export default LandingPage
