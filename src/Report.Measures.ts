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
import { MeasureCategory, MeasurementInfo, ReportMeasurementEntry } from './Report.Definitions'
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
  measurementEntries: Array<ReportMeasurementEntry>
): Array<ReportMeasurementEntry> => {
  // Update measurementEntries with config values from inputs
  measurementEntries.forEach((entry) => {
    // get the property value of inputs
    entry.Info.ConfigValue = (configValues as { [key: string]: string | number })[entry.Info.ConfigurationName]
  })
  return measurementEntries
}

export const GetActiveMeasures = (entries: Array<ReportMeasurementEntry>): Array<ReportMeasurementEntry> => {
  return entries.filter((entry) => entry.Info.ConfigValue === 'yes')
}

export const MetricTable = new Array<ReportMeasurementEntry>()
MetricTable.push(
  new ReportMeasurementEntry(
    'additions',
    new MeasurementInfo('Number of added lines', 0, 0, 'ShowAdditions', 'yes', MeasureCategory.StaticMeasures),
    GetAddedLines
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'deleted',
    new MeasurementInfo('Number of deleted lines', 0, 0, 'ShowDeleted', 'yes', MeasureCategory.StaticMeasures),
    GetDeletedLines
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'changedFiles',
    new MeasurementInfo(
      'Number of changed files',
      0,
      0,
      'ShowNumberOfChangedFiles',
      'yes',
      MeasureCategory.StaticMeasures
    ),
    GetChangedFilesCount
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'commits',
    new MeasurementInfo('Number of commits', 0, 0, 'ShowNumberOfCommits', 'yes', MeasureCategory.StaticMeasures),
    GetCommitsCount
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'reviews',
    new MeasurementInfo('Number of reviews', 0, 0, 'ShowNumberOfReviews', 'yes', MeasureCategory.StaticMeasures),
    GetReviewCount
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'comments',
    new MeasurementInfo(
      'Number of comments (w/o review comments)',
      0,
      0,
      'ShowNumberOfComments',
      'yes',
      MeasureCategory.StaticMeasures
    ),
    GetCommentCount
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'pr_lead_time',
    new MeasurementInfo(
      'PR lead time (from creation to close of PR)',
      0,
      0,
      'ShowPRLeadTime',
      'yes',
      MeasureCategory.TimeRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetLeadTimeForPullRequest(pr))
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'pr_time_branch_before_pr',
    new MeasurementInfo(
      'Time that was spend on the branch before the PR was created',
      0,
      0,
      'ShowTimeSpendOnBranchBeforePrCreated',
      'yes',
      MeasureCategory.TimeRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetTimeSpendOnBranchBeforePRCreated(pr))
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'pr_time_branch_before_merge',
    new MeasurementInfo(
      'Time that was spend on the branch before the PR was merged',
      0,
      0,
      'ShowTimeSpendOnBranchBeforePrMerged',
      'yes',
      MeasureCategory.TimeRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetTimeSpendOnBranchBeforePRMerged(pr))
  )
)
MetricTable.push(
  new ReportMeasurementEntry(
    'pr_time_to_merge_after_last_review',
    new MeasurementInfo(
      'Time to merge after last review',
      0,
      0,
      'ShowTimeToMergeAfterLastReview',
      'yes',
      MeasureCategory.TimeRelatedMeasures
    ),
    (pr) => MillisecondsToReadableDuration(GetTimeToMergeAfterLastReview(pr))
  )
)

MetricTable.push(
  new ReportMeasurementEntry(
    'no_of_comment_only_reviews',
    new MeasurementInfo(
      'Number of reviews that contains a comment to resolve',
      0,
      0,
      'ShowNumberOfCommentOnlyReviews',
      'yes',
      MeasureCategory.StaticMeasures
    ),
    (pr) => GetNumberOfCommentOnlyReviews(pr)
  )
)

MetricTable.push(
  new ReportMeasurementEntry(
    'no_of_change_requested_reviews',
    new MeasurementInfo(
      'Number of reviews that requested a change from the author',
      0,
      0,
      'ShowNumberOfRequestedChangeReviews',
      'yes',
      MeasureCategory.StaticMeasures
    ),
    (pr) => GetNumberOfRequestedChangeReviews(pr)
  )
)

MetricTable.push(
  new ReportMeasurementEntry(
    'no_of_approved_reviews',
    new MeasurementInfo(
      'Number of reviews that approved the Pull Request',
      0,
      0,
      'ShowNumberOfApprovedReviews',
      'yes',
      MeasureCategory.StaticMeasures
    ),
    (pr) => GetNumberOfApprovedReviews(pr)
  )
)

MetricTable.push(
  new ReportMeasurementEntry(
    'pr_time_total_runtime_for_last_status_check_run',
    new MeasurementInfo(
      'Total runtime for last status check run (Workflow for PR)',
      0,
      0,
      'ShowTimeTotalRuntimeForLastStatusCheckRun',
      'yes',
      MeasureCategory.StatusCheckRelated
    ),
    (pr) => MillisecondsToReadableDuration(GetTotalRuntimeForLastStatusCheckRun(pr))
  )
)

MetricTable.push(
  new ReportMeasurementEntry(
    'pr_time_spend_in_pr_for_last_status_check_run',
    new MeasurementInfo(
      'Total time spend in last status check run on PR',
      0,
      0,
      'ShowTimeSpendOnPrForLastStatusCheckRun',
      'yes',
      MeasureCategory.StatusCheckRelated
    ),
    (pr) => MillisecondsToReadableDuration(GetTimeSpendInPrForLastStatusCheckRun(pr))
  )
)

MetricTable.push(
  new ReportMeasurementEntry(
    'pr_total_number_of_participants',
    new MeasurementInfo(
      'Get the total number of participants of a Pull Request',
      0,
      0,
      'ShowTotalNumberOfParticipants',
      'yes',
      MeasureCategory.StaticMeasures
    ),
    (pr) => GetTotalNumberOfParticipants(pr)
  )
)
