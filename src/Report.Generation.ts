// for license and copyright look at the repository

import { IPullRequest } from './Interfaces/PullRequestTypes'
import { IReport } from './Interfaces/ReportTypes'
import { tsMarkdown, table, TableEntry, H1Entry, H3Entry, MarkdownEntry } from 'ts-markdown'
import { MeasureCategory, MeasureCategoryTitleMap } from './Report.Definitions'

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

  public GenerateMeasureTable(pr: IPullRequest, report: IReport): MarkdownEntry[] {
    const tables: MarkdownEntry[] = []
    const categories = new Set(report.Entries.map((entry) => entry.Info.MeasureCategory))
    categories.forEach((category) => {
      tables.push(this.GenerateCategoryTitle(category))
      tables.push(this.GenerateCategoryTable(pr, report, category))
    })

    return tables
  }

  private GenerateCategoryTitle(measureCategory: MeasureCategory): H3Entry {
    const title = { h3: `${MeasureCategoryTitleMap.get(measureCategory) || 'No category'}` }
    return title
  }

  private GenerateCategoryTable(pr: IPullRequest, report: IReport, measureCategory: MeasureCategory): TableEntry {
    const categoryEntries = report.Entries.filter((entry) => entry.Info.MeasureCategory === measureCategory)
    categoryEntries.forEach((entry) => {
      entry.Info.Value = entry.ReportMeasureCallback(pr)
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
