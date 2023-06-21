// for license and copyright look at the repository

import {
  MillisecondsToReadableDuration,
  GetLeadTimeForPullRequest,
  GetTimeSpendOnBranchBeforePRCreated,
  GetTimeSpendOnBranchBeforePRMerged,
  GetTimeToMergeAfterLastReview,
  GetTotalRuntimeForLastStatusCheckRun,
  GetTimeSpendInPrForLastStatusCheckRun,
  GetNumberOfCommentOnlyReviews,
  GetNumberOfRequestedChangeReviews,
  GetNumberOfApprovedReviews,
  GetTotalNumberOfParticipants,
} from './Report.Calculation'
import { ConfigurationCategory, ConfigurationInfo, ReportConfigurationEntry } from './Report.Definitions'
import {
  GetAddedLines,
  GetDeletedLines,
  GetChangedFilesCount,
  GetCommitsCount,
  GetReviewCount,
  GetCommentCount,
} from './Report.Functions'
import { ConfigurationInputs } from './action.config.type'

export const UpdateConfigValues = (
  configValues: ConfigurationInputs,
  measurementEntries: Array<ReportConfigurationEntry>
): Array<ReportConfigurationEntry> => {
  // Update measurementEntries with config values from inputs
  measurementEntries.forEach((entry) => {
    // get the property value of inputs
    entry.Info.ConfigValue = (configValues as { [key: string]: string | number })[entry.Info.ConfigurationName]
  })
  return measurementEntries
}

export const GetActiveMeasures = (entries: Array<ReportConfigurationEntry>): Array<ReportConfigurationEntry> => {
  return entries.filter((entry) => entry.Info.ConfigValue === 'yes')
}

export const ReportConfigurationTable = new Array<ReportConfigurationEntry>()

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'include_raw_data_as_md_comment',
    new ConfigurationInfo(
      'Add raw PR data as markdown comment in the PR Report (of the PR)',
      0,
      0,
      'IncludeRawDataAsMarkdownComment',
      'yes',
      ConfigurationCategory.ReportGeneratorValue
    ),
    () => 0
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'create_report_comment',
    new ConfigurationInfo(
      'Add PR report to the PR as comment',
      0,
      0,
      'AddPrReportAsComment',
      'yes',
      ConfigurationCategory.ReportGeneratorValue
    ),
    () => 0
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'title_string',
    new ConfigurationInfo(
      'Pull Request Report',
      0,
      0,
      'ReportTitle',
      'Pull Request Report',
      ConfigurationCategory.ReportGeneratorValue
    ),
    () => 0
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'additions',
    new ConfigurationInfo('Number of added lines', 0, 0, 'ShowAdditions', 'yes', ConfigurationCategory.StaticMeasures),
    GetAddedLines
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'deleted',
    new ConfigurationInfo('Number of deleted lines', 0, 0, 'ShowDeleted', 'yes', ConfigurationCategory.StaticMeasures),
    GetDeletedLines
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'changedFiles',
    new ConfigurationInfo(
      'Number of changed files',
      0,
      0,
      'ShowNumberOfChangedFiles',
      'yes',
      ConfigurationCategory.StaticMeasures
    ),
    GetChangedFilesCount
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'commits',
    new ConfigurationInfo(
      'Number of commits',
      0,
      0,
      'ShowNumberOfCommits',
      'yes',
      ConfigurationCategory.StaticMeasures
    ),
    GetCommitsCount
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'reviews',
    new ConfigurationInfo(
      'Number of reviews',
      0,
      0,
      'ShowNumberOfReviews',
      'yes',
      ConfigurationCategory.StaticMeasures
    ),
    GetReviewCount
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'comments',
    new ConfigurationInfo(
      'Number of comments (w/o review comments)',
      0,
      0,
      'ShowNumberOfComments',
      'yes',
      ConfigurationCategory.StaticMeasures
    ),
    GetCommentCount
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'pr_lead_time',
    new ConfigurationInfo(
      'PR lead time (from creation to close of PR)',
      0,
      0,
      'ShowPRLeadTime',
      'yes',
      ConfigurationCategory.TimeRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetLeadTimeForPullRequest(pr))
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'pr_time_branch_before_pr',
    new ConfigurationInfo(
      'Time that was spend on the branch before the PR was created',
      0,
      0,
      'ShowTimeSpendOnBranchBeforePrCreated',
      'yes',
      ConfigurationCategory.TimeRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetTimeSpendOnBranchBeforePRCreated(pr))
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'pr_time_branch_before_merge',
    new ConfigurationInfo(
      'Time that was spend on the branch before the PR was merged',
      0,
      0,
      'ShowTimeSpendOnBranchBeforePrMerged',
      'yes',
      ConfigurationCategory.TimeRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetTimeSpendOnBranchBeforePRMerged(pr))
  )
)
ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'pr_time_to_merge_after_last_review',
    new ConfigurationInfo(
      'Time to merge after last review',
      0,
      0,
      'ShowTimeToMergeAfterLastReview',
      'yes',
      ConfigurationCategory.TimeRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetTimeToMergeAfterLastReview(pr))
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'no_of_comment_only_reviews',
    new ConfigurationInfo(
      'Number of reviews that contains a comment to resolve',
      0,
      0,
      'ShowNumberOfCommentOnlyReviews',
      'yes',
      ConfigurationCategory.StaticMeasures
    ),
    (pr) => GetNumberOfCommentOnlyReviews(pr)
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'no_of_change_requested_reviews',
    new ConfigurationInfo(
      'Number of reviews that requested a change from the author',
      0,
      0,
      'ShowNumberOfRequestedChangeReviews',
      'yes',
      ConfigurationCategory.StaticMeasures
    ),
    (pr) => GetNumberOfRequestedChangeReviews(pr)
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'no_of_approved_reviews',
    new ConfigurationInfo(
      'Number of reviews that approved the Pull Request',
      0,
      0,
      'ShowNumberOfApprovedReviews',
      'yes',
      ConfigurationCategory.StaticMeasures
    ),
    (pr) => GetNumberOfApprovedReviews(pr)
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'pr_time_total_runtime_for_last_status_check_run',
    new ConfigurationInfo(
      'Total runtime for last status check run (Workflow for PR)',
      0,
      0,
      'ShowTimeTotalRuntimeForLastStatusCheckRun',
      'yes',
      ConfigurationCategory.StatusCheckRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetTotalRuntimeForLastStatusCheckRun(pr))
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'pr_time_spend_in_pr_for_last_status_check_run',
    new ConfigurationInfo(
      'Total time spend in last status check run on PR',
      0,
      0,
      'ShowTimeSpendOnPrForLastStatusCheckRun',
      'yes',
      ConfigurationCategory.StatusCheckRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetTimeSpendInPrForLastStatusCheckRun(pr))
  )
)

ReportConfigurationTable.push(
  new ReportConfigurationEntry(
    'pr_total_number_of_participants',
    new ConfigurationInfo(
      'Get the total number of participants of a Pull Request',
      0,
      0,
      'ShowTotalNumberOfParticipants',
      'yes',
      ConfigurationCategory.StaticMeasures
    ),
    (pr) => GetTotalNumberOfParticipants(pr)
  )
)
