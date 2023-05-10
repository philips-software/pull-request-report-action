// for license and copyright look at the repository

import { GetPullRequestData } from '../src/GitHubCliHelper'
import { PullRequest } from '../src/PullRequest.Definitions'
describe('CliIntegrationTest', () => {
  test('Check that we can request from CLI tool', async () => {
    const pullRequestData = await GetPullRequestData(381, 'aertslab/SCope')
    expect(pullRequestData).toBeDefined()
  })

  test('Check that we can request, and read the data in our data model', async () => {
    const pullRequestJson = await GetPullRequestData(381, 'aertslab/SCope')
    const pullRequest = PullRequest.CreateFromJson(pullRequestJson)
    expect(pullRequest.id).toBe(381)
    expect(pullRequest.reviews.length).toBeGreaterThan(0)
    expect(pullRequest.comments.length).toBeGreaterThan(0)
    expect(pullRequest.statusChecks.length).toBeGreaterThan(0)
    expect(pullRequest.commits.length).toBeGreaterThan(0)
  })
})
