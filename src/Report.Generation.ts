// for license and copyright look at the repository

import { IPullRequest } from './Interfaces/PullRequestTypes'
import { IReport, IReportConfigurationEntry } from './Interfaces/ReportTypes'
import { tsMarkdown, table, TableEntry, H1Entry, H3Entry, MarkdownEntry } from 'ts-markdown'
import { ConfigurationCategory, ConfigurationCategoryTitleMap } from './Report.Definitions'

export class ReportGenerator {
  DescriptionHeaderLabel = 'Description'
  ValueHeaderLabel = 'Value'

  public Generate(pr: IPullRequest, report: IReport): string {
    const header = this.GenerateHeader(pr, report)
    const table = this.GenerateMeasureTable(pr, report)
    const reportElements = [header, ...table]
    return tsMarkdown(reportElements)
  }

  public GenerateHeader(pr: IPullRequest, report: IReport): H1Entry {
    const title = { h1: `${report.Description} (#${pr.id})` }
    return title
  }

  public GetMeasurementEntries(entries: IReportConfigurationEntry[]): IReportConfigurationEntry[] {
    if (entries !== undefined && entries !== null && entries.length > 0) {
      return entries.filter((entry) => ConfigurationCategory[entry.Info.ConfigurationCategory].endsWith('Measures'))
    }

    return []
  }

  public GenerateMeasureTable(pr: IPullRequest, report: IReport): MarkdownEntry[] {
    const tables: MarkdownEntry[] = []
    const entries = this.GetMeasurementEntries(report.Entries)
    const categories = new Set(entries.map((entry) => entry.Info.ConfigurationCategory))
    categories.forEach((category) => {
      tables.push(this.GenerateCategoryTitle(category))
      tables.push(this.GenerateCategoryTable(pr, report, category))
    })

    return tables
  }

  private GenerateCategoryTitle(measureCategory: ConfigurationCategory): H3Entry {
    const title = { h3: `${ConfigurationCategoryTitleMap.get(measureCategory) || 'No category'}` }
    return title
  }

  private GenerateCategoryTable(pr: IPullRequest, report: IReport, measureCategory: ConfigurationCategory): TableEntry {
    const entries = this.GetMeasurementEntries(report.Entries)
    const categoryEntries = entries.filter((entry) => entry.Info.ConfigurationCategory === measureCategory)
    categoryEntries.forEach((entry) => {
      entry.Info.Value = entry.PullRequestCallback(pr)
    })

    const rows = categoryEntries.map((entry) => ({
      Description: entry.Info.Description,
      Value: entry.Info.Value,
    }))

    return table({
      columns: [{ name: this.DescriptionHeaderLabel }, { name: this.ValueHeaderLabel }],
      rows: rows,
    })
  }
}
