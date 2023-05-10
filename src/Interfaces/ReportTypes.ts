// for license and copyright look at the repository

import { MeasureCategory } from '../Report.Definitions'
import { IPullRequest } from './PullRequestTypes'

export type MeasureCallback = (pr: IPullRequest) => string | number

export interface IReportMeasurementInfo {
  Description: string
  PresentationValue: string | number
  Value: string | number
  ConfigurationName: string
  MeasureCategory: MeasureCategory
  ConfigValue: string | number
}

export interface IReportMeasurementEntry {
  Id: string
  Info: IReportMeasurementInfo
  ReportMeasureCallback: MeasureCallback
}

export interface IReport {
  Id: string
  Description: string
  Entries: IReportMeasurementEntry[]
}

export interface EventWithTime {
  type: string
  date: Date
  time: number
  event_instance: unknown
}
