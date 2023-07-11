// for license and copyright look at the repository

import { IPullRequest } from '../src/Interfaces/PullRequestTypes'
import { PullRequest } from '../src/PullRequest.Definitions'
import { Report } from '../src/Report.Definitions'
import { ReportGenerator } from '../src/Report.Generation'
import { ReportConfigurationTable } from '../src/Report.Measures'
import { DataFromBigPullRequest } from './pr_sample_data'
import { tsMarkdown } from 'ts-markdown'

let PullRequestJsonModel: unknown
let PullRequestStatModel: IPullRequest

beforeAll(() => {
  PullRequestJsonModel = DataFromBigPullRequest
  PullRequestStatModel = PullRequest.CreateFromJson(PullRequestJsonModel)
})

test('Check if header is generated as expected', () => {
  const generator = new ReportGenerator()
  const report = new Report()
  report.Description = 'Pull Request Report for PR'
  expect(tsMarkdown([generator.GenerateHeader(PullRequestStatModel, report)])).toBe(
    '# Pull Request Report for PR (#381)',
  )
})

test('Check if table is generated as expected', () => {
  const generator = new ReportGenerator()
  const report = new Report()
  report.Entries = ReportConfigurationTable
  report.Description = 'Test report'
  report.Id = PullRequestStatModel.id.toString()
  const table = generator.GenerateMeasureTable(PullRequestStatModel, report)
  const result = tsMarkdown(table)
  expect(result.length).toBeGreaterThan(0)
})

test('Check if whole report is generated as expected', () => {
  const generator = new ReportGenerator()
  const report = new Report()
  report.Entries = ReportConfigurationTable
  report.Description = 'Test report'
  report.Id = PullRequestStatModel.id.toString()
  const result = generator.Generate(PullRequestStatModel, report)
  expect(result.length).toBeGreaterThan(0)
})
