//GENERATED FILE FROM report.config.tests.ts - DO NOT EDIT!!!

import * as core from '@actions/core'

export const config = {
  IncludeRawDataAsMarkdownComment: core.getInput('IncludeRawDataAsMarkdownComment', { required: false }),
  AddPrReportAsComment: core.getInput('AddPrReportAsComment', { required: false }),
  ReportTitle: core.getInput('ReportTitle', { required: false }),
  ShowAdditions: core.getInput('ShowAdditions', { required: false }),
  ShowDeleted: core.getInput('ShowDeleted', { required: false }),
  ShowNumberOfChangedFiles: core.getInput('ShowNumberOfChangedFiles', { required: false }),
  ShowNumberOfCommits: core.getInput('ShowNumberOfCommits', { required: false }),
  ShowNumberOfReviews: core.getInput('ShowNumberOfReviews', { required: false }),
  ShowNumberOfComments: core.getInput('ShowNumberOfComments', { required: false }),
  ShowNumberOfCommentOnlyReviews: core.getInput('ShowNumberOfCommentOnlyReviews', { required: false }),
  ShowNumberOfRequestedChangeReviews: core.getInput('ShowNumberOfRequestedChangeReviews', { required: false }),
  ShowNumberOfApprovedReviews: core.getInput('ShowNumberOfApprovedReviews', { required: false }),
  ShowTotalNumberOfParticipants: core.getInput('ShowTotalNumberOfParticipants', { required: false }),
  ShowTimeTotalRuntimeForLastStatusCheckRun: core.getInput('ShowTimeTotalRuntimeForLastStatusCheckRun', { required: false }),
  ShowTimeSpendOnPrForLastStatusCheckRun: core.getInput('ShowTimeSpendOnPrForLastStatusCheckRun', { required: false }),
  ShowPRLeadTime: core.getInput('ShowPRLeadTime', { required: false }),
  ShowTimeSpendOnBranchBeforePrCreated: core.getInput('ShowTimeSpendOnBranchBeforePrCreated', { required: false }),
  ShowTimeSpendOnBranchBeforePrMerged: core.getInput('ShowTimeSpendOnBranchBeforePrMerged', { required: false }),
  ShowTimeToMergeAfterLastReview: core.getInput('ShowTimeToMergeAfterLastReview', { required: false }),
}
