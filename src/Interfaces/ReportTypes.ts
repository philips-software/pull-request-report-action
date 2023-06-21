// for license and copyright look at the repository

import { ConfigurationCategory } from '../Report.Definitions'
import { IPullRequest } from './PullRequestTypes'

export type PullRequestCallback = (pr: IPullRequest) => string | number

export interface IReportConfigInfo {
  Description: string
  PresentationValue: string | number
  Value: string | number
  ConfigurationName: string
  ConfigurationCategory: ConfigurationCategory
  ConfigValue: string | number
}

export interface IReportConfigurationEntry {
  Id: string
  Info: IReportConfigInfo
  PullRequestCallback: PullRequestCallback
}

export interface IReport {
  Id: string
  Description: string
  Entries: IReportConfigurationEntry[]
}

export interface EventWithTime {
  type: string
  date: Date
  time: number
  event_instance: unknown
}
