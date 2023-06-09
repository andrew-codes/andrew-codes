import type { GetStagedApps } from "./apps"
import { Octokit } from "octokit"
import { keyBy, merge } from "lodash"

const withGitHubInfo = (
  ghToken: string,
  getApps: GetStagedApps,
): GetStagedApps => {
  const octokit = new Octokit({
    auth: ghToken,
  })
  return async (stagingDirectory: string) => {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: "andrew-codes",
      repo: "andrew-codes",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    const prs = keyBy(data, (pr) => pr.number.toString())
    const apps = await getApps(stagingDirectory)

    return apps.map((app) =>
      merge(app, {
        title: prs[app.prId]?.title,
        description: prs[app.prId]?.body,
        state: prs[app.prId]?.state,
        url: prs[app.prId]?.html_url,
      }),
    )
  }
}

export { withGitHubInfo }
