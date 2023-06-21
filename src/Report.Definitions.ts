// for license and copyright look at the repository

import { IReport, IReportConfigurationEntry, IReportConfigInfo, PullRequestCallback } from './Interfaces/ReportTypes'

export enum ConfigurationCategory {
  None,
  StaticMeasures,
  TimeRelatedMeasures,
  StatusCheckRelatedMeasures,
  ReportGeneratorValue,
}

export const ConfigurationCategoryTitleMap = new Map<ConfigurationCategory, string>([
  [ConfigurationCategory.None, 'None'],
  [ConfigurationCategory.StaticMeasures, 'Static measures'],
  [ConfigurationCategory.TimeRelatedMeasures, 'Time related measures'],
  [ConfigurationCategory.StatusCheckRelatedMeasures, 'Status check related measures'],
  [ConfigurationCategory.ReportGeneratorValue, 'Report generator related predefined strings'],
])

export class ConfigurationInfo implements IReportConfigInfo {
  public Description
  public PresentationValue
  public Value
  public ConfigurationName
  public ConfigValue
  public ConfigurationCategory

  constructor(
    label: string,
    presentationValue: string | number,
    value: string | number,
    configName: string,
    defaultConfigValue: string | number,
    configurationCategory: ConfigurationCategory
  ) {
    this.Description = label
    this.PresentationValue = presentationValue
    this.Value = value
    this.ConfigurationName = configName
    this.ConfigValue = defaultConfigValue
    this.ConfigurationCategory = configurationCategory
  }
}

export class ReportConfigurationEntry implements IReportConfigurationEntry {
  public Id
  public Info
  public PullRequestCallback: PullRequestCallback
  constructor(id = '', info: IReportConfigInfo, measureCallback: PullRequestCallback = () => '') {
    this.Id = id
    this.Info = info
    this.PullRequestCallback = measureCallback
  }
}

export class Report implements IReport {
  public Id = ''
  public Description = ''
  public Entries: ReportConfigurationEntry[] = []
}
