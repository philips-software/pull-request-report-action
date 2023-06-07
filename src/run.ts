import * as core from '@actions/core'
import * as github from '@actions/github'
import { AddCommentToPR, GetPullRequestData } from './GitHubCliHelper'
import { ReportGenerator } from './Report.Generation'
import { Report, ReportMeasurementEntry } from './Report.Definitions'
import { GetActiveMeasures, MetricTable, UpdateConfigValues as UpdateConfig } from './Report.Measures'
import { PullRequest } from './PullRequest.Definitions'
import * as fs from 'fs'
import { ConfigurationInputs } from './action.config.type'
import { IPullRequest } from './Interfaces/PullRequestTypes'
import { IReport } from './Interfaces/ReportTypes'

const CreatePRCommentFile = (prData: unknown, commentText: string): string => {
  // generate random file name
  const fileName = Math.random().toString(36).substring(7) + '.md'
  const jsonString = JSON.stringify(prData)
  // write report string to file
  fs.writeFileSync(fileName, `<!-- ${jsonString} -->\n${commentText}`)

  return `${process.env.GITHUB_WORKSPACE || './'}/${fileName}`
}

const GenerateReport = (activeConfigValues: ReportMeasurementEntry[], pullRequestDataModel: IPullRequest): IReport => {
  const report = new Report()
  report.Entries = activeConfigValues
  report.Description = 'Test report'
  report.Id = pullRequestDataModel.id.toString()
  return report
}

export const run = async (inputsFromWorkflow: ConfigurationInputs): Promise<number> => {
  // take care that action is running only in PR context
  if (process.env.GITHUB_EVENT_NAME !== 'pull_request') {
    core.setFailed('Action is running outside of PR context')
    return 0
  }

  UpdateConfig(inputsFromWorkflow, MetricTable)
  const activeConfigValues = GetActiveMeasures(MetricTable)

  // get PR data from github cli
  const cliPullRequestData = await GetPullRequestData(github.context.issue.number)
  // transform PR data to a typed model
  const pullRequestDataModel = PullRequest.CreateFromJson(cliPullRequestData)
  // generate the report of the typed model
  const generator = new ReportGenerator()
  const report = GenerateReport(activeConfigValues, pullRequestDataModel)
  // create report
  const reportAsString = generator.Generate(pullRequestDataModel, report)

  const commentPath = CreatePRCommentFile(cliPullRequestData, reportAsString)
  await AddCommentToPR(commentPath, pullRequestDataModel.id)

  const jsonPath = commentPath.replace(/\.md$/, '.json')
  fs.writeFileSync(jsonPath, JSON.stringify(cliPullRequestData))
  core.setOutput('json_report_path', jsonPath)

  return 0
}
