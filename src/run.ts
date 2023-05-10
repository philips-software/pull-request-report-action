import * as core from '@actions/core'
import * as github from '@actions/github'
import { AddCommentToPR, GetPullRequestData } from './GitHubCliHelper'
import { ReportGenerator } from './Report.Generation'
import { Report } from './Report.Definitions'
import { GetActiveMeasures, MetricTable, UpdateConfigValues } from './Report.Measures'
import { PullRequest } from './PullRequest.Definitions'
import * as fs from 'fs'
import { ConfigurationInputs } from './action.config.type'

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputsFromWorkflow: ConfigurationInputs): Promise<number> => {
  // take care that action is running only in PR context
  if (process.env.GITHUB_EVENT_NAME !== 'pull_request') {
    core.setFailed('Action is running outside of PR context')
    return 0
  }

  UpdateConfigValues(inputsFromWorkflow, MetricTable)
  const activeConfigValues = GetActiveMeasures(MetricTable)

  // get PR number
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  const cliPullRequestData = await GetPullRequestData(github.context.issue.number)
  const pullRequestDataModel = PullRequest.CreateFromJson(cliPullRequestData)
  const generator = new ReportGenerator()
  const report = new Report()
  report.Entries = activeConfigValues
  report.Description = 'Test report'
  report.Id = pullRequestDataModel.id.toString()
  const reportAsString = generator.Generate(pullRequestDataModel, report)
  // generate random file name
  const fileName = Math.random().toString(36).substring(7) + '.md'
  // write report string to file
  fs.writeFileSync(fileName, `<!-- ${JSON.stringify(cliPullRequestData)} -->\n${reportAsString}`)
  //  core.info(`my name is ${inputs.name}`)
  await AddCommentToPR(fileName, pullRequestDataModel.id)
  return 12
}
