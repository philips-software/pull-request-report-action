// for license and copyright look at the repository

import { table, tsMarkdown } from 'ts-markdown'
import { GetActiveMeasures, MetricTable, UpdateConfigValues } from '../src/Report.Measures'
import * as fs from 'fs'
import { MeasureCategory, ReportMeasurementEntry } from '../src/Report.Definitions'
import yaml from 'js-yaml'
import { ConfigurationInputs } from '../src/action.config.type'

let rows: { Name: string; Description: string; DefaultValue: string | number; Category: string }[] = []

beforeAll(() => {
  const configItems = MetricTable.map((item) => {
    return {
      description: item.Info.Description,
      name: item.Info.ConfigurationName,
      category: MeasureCategory[item.Info.MeasureCategory],
      defaultValue: item.Info.ConfigValue,
    }
  })

  rows = configItems
    .map((entry) => ({
      Name: entry.name,
      Description: entry.description,
      DefaultValue: entry.defaultValue,
      Category: entry.category,
    }))
    .sort((a, b) => {
      if (a.Category < b.Category) {
        return -1
      }
      if (a.Category > b.Category) {
        return 1
      }
      return 0
    })
})

test('Generate documentation for configuration items', () => {
  const configValues = table({
    columns: [{ name: 'Name' }, { name: 'Description' }, { name: 'Category' }, { name: 'DefaultValue' }],
    rows: rows,
  })

  const defaultConfigMeasures = tsMarkdown([configValues])

  expect(defaultConfigMeasures.length).toBeGreaterThan(0)
  // read content from file
  const fileContent = fs.readFileSync('config.values.default.md', 'utf8')
  const mergedContent = fileContent.concat('\n').concat(defaultConfigMeasures)
  // write to file
  fs.writeFileSync('config.md', mergedContent)
})

test('Generate valid input keys and patch the action.yml file', () => {
  const inputValues: { [index: string]: { description: string; default: string | number; required: boolean } } = {}
  rows.map((row) => {
    inputValues[row.Name] = { description: row.Description, default: row.DefaultValue, required: false }
  })
  // load action yaml file
  const actions = yaml.load(fs.readFileSync('action.yml', 'utf8')) as {
    inputs: { [index: string]: { description: string; default: string | number; required: boolean } }
  }
  actions.inputs = inputValues
  const serializedString = yaml.dump(actions)
  expect(serializedString.length).toBeGreaterThan(0)
  fs.writeFileSync('action.yml', serializedString)
})

const CreateMetricTableCopy = (table: ReportMeasurementEntry[]): ReportMeasurementEntry[] => {
  const tableAsJson = JSON.stringify(table)
  return JSON.parse(tableAsJson) as ReportMeasurementEntry[]
}

test('Update the MetricTable with config values from workflow', () => {
  const inputValuesFromWorkflow = {} as ConfigurationInputs
  inputValuesFromWorkflow.ShowAdditions = 'yes'
  inputValuesFromWorkflow.ShowDeleted = 'yes'
  inputValuesFromWorkflow.ShowNumberOfChangedFiles = 'yes'
  inputValuesFromWorkflow.ShowNumberOfCommits = 'no'
  inputValuesFromWorkflow.ShowNumberOfReviews = 'no'
  inputValuesFromWorkflow.ShowNumberOfComments = 'no'
  inputValuesFromWorkflow.ShowPRLeadTime = 'yes'
  inputValuesFromWorkflow.ShowTimeSpendOnBranchBeforePrCreated = 'no'
  inputValuesFromWorkflow.ShowTimeSpendOnBranchBeforePrMerged = 'no'
  inputValuesFromWorkflow.ShowTimeToMergeAfterLastReview = 'no'
  // create copy of MetricTable
  const myMetricTable: ReportMeasurementEntry[] = CreateMetricTableCopy(MetricTable)
  expect(
    MetricTable.filter((item) => item.Info.ConfigurationName === 'ShowTimeToMergeAfterLastReview')[0].Info.ConfigValue
  ).toBe('yes')
  UpdateConfigValues(inputValuesFromWorkflow, myMetricTable)
  expect(
    myMetricTable.filter((item) => item.Info.ConfigurationName === 'ShowTimeToMergeAfterLastReview')[0].Info.ConfigValue
  ).toBe('no')
})

test('Filter the MetricTable with config values from workflow', () => {
  const inputValuesFromWorkflow = {} as ConfigurationInputs
  inputValuesFromWorkflow.ShowAdditions = 'yes'
  inputValuesFromWorkflow.ShowDeleted = 'yes'
  inputValuesFromWorkflow.ShowNumberOfChangedFiles = 'yes'
  inputValuesFromWorkflow.ShowNumberOfCommits = 'no'
  inputValuesFromWorkflow.ShowNumberOfReviews = 'no'
  inputValuesFromWorkflow.ShowNumberOfComments = 'no'
  inputValuesFromWorkflow.ShowPRLeadTime = 'yes'
  inputValuesFromWorkflow.ShowTimeSpendOnBranchBeforePrCreated = 'no'
  inputValuesFromWorkflow.ShowTimeSpendOnBranchBeforePrMerged = 'no'
  inputValuesFromWorkflow.ShowTimeToMergeAfterLastReview = 'yes'
  // create copy of MetricTable
  const myMetricTable: ReportMeasurementEntry[] = CreateMetricTableCopy(MetricTable)
  UpdateConfigValues(inputValuesFromWorkflow, myMetricTable)
  const activeMeasures = GetActiveMeasures(myMetricTable)
  expect(
    activeMeasures.filter((item) => item.Info.ConfigurationName === 'ShowTimeToMergeAfterLastReview')[0].Info
      .ConfigValue
  ).toBe('yes')
  expect(
    activeMeasures.filter((item) => item.Info.ConfigurationName === 'ShowTimeSpendOnBranchBeforePrMerged').length
  ).toBe(0)
})

test('Generate configuration arguments for action code', () => {
  const inputValues: { [index: string]: { description: string; default: string | number; required: boolean } } = {}
  rows.map((row) => {
    inputValues[row.Name] = { description: row.Description, default: row.DefaultValue, required: false }
  })
  const generatedArgumentFile = 'src/action.config.args.ts'
  const generatedTypeFile = 'src/action.config.type.ts'

  // first call is write to generate a new new file (with overwrite)
  fs.writeFileSync(generatedArgumentFile, '//GENERATED FILE FROM report.config.tests.ts - DO NOT EDIT!!!\n\n')
  fs.writeFileSync(generatedTypeFile, '//GENERATED FILE FROM report.config.tests.ts - DO NOT EDIT!!!\n\n')
  // from now on we append to the files
  fs.appendFileSync(generatedArgumentFile, "import * as core from '@actions/core'\n\n")
  fs.appendFileSync(generatedArgumentFile, 'export const config = {\n')
  fs.appendFileSync(generatedTypeFile, 'export type ConfigurationInputs = {\n')
  for (const key in inputValues) {
    fs.appendFileSync(
      generatedArgumentFile,
      `  ${key}: core.getInput('${key}', { required: ${inputValues[key].required.toString()} }),\n`
    )
    fs.appendFileSync(generatedTypeFile, `  ${key}: string | number\n`)
  }
  fs.appendFileSync(generatedArgumentFile, '}\n')
  fs.appendFileSync(generatedTypeFile, '}\n')
  expect(fs.statSync(generatedArgumentFile).size).toBeGreaterThan(10)
})
