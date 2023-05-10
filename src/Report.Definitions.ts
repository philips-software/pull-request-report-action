// for license and copyright look at the repository

import { IReport, IReportMeasurementEntry, IReportMeasurementInfo, MeasureCallback } from './Interfaces/ReportTypes'

export enum MeasureCategory {
  None,
  StaticMeasures,
  TimeRelatedMeasures,
  StatusCheckRelated,
}

export const MeasureCategoryTitleMap = new Map<MeasureCategory, string>([
  [MeasureCategory.None, 'None'],
  [MeasureCategory.StaticMeasures, 'Static measures'],
  [MeasureCategory.TimeRelatedMeasures, 'Time related measures'],
  [MeasureCategory.StatusCheckRelated, 'Status check related measures'],
])

export class MeasurementInfo implements IReportMeasurementInfo {
  public Description
  public PresentationValue
  public Value
  public ConfigurationName
  public ConfigValue
  public MeasureCategory

  constructor(
    label: string,
    presentationValue: string | number,
    value: string | number,
    configName: string,
    defaultConfigValue: string | number,
    measureCategory: MeasureCategory
  ) {
    this.Description = label
    this.PresentationValue = presentationValue
    this.Value = value
    this.ConfigurationName = configName
    this.ConfigValue = defaultConfigValue
    this.MeasureCategory = measureCategory
  }
}

export class ReportMeasurementEntry implements IReportMeasurementEntry {
  public Id
  public Info
  public ReportMeasureCallback: MeasureCallback
  constructor(id = '', info: IReportMeasurementInfo, measureCallback: MeasureCallback = () => '') {
    this.Id = id
    this.Info = info
    this.ReportMeasureCallback = measureCallback
  }
}

export class Report implements IReport {
  public Id = ''
  public Description = ''
  public Entries: ReportMeasurementEntry[] = []
}
