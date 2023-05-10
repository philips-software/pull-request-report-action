# Config Values for PR Report

## Details

To activate and deactivate the individual metrics, you need to configure them in
your workflow file. The following example shows how to do this:

```yaml
      - name: Generate PR report
        uses: philips-software/pull-request-report-action
        with:
          ShowNumberOfChangedFiles: 'no'
          ShowTimeToMergeAfterLastReview: 'no'
        env:
          GITHUB_TOKEN: ${{ github.token }}
```

You only need to change the value from `yes` to `no` to deactivate the metric.
By default, all metrics are activated as you can see in the overview table.

## Overview

| Name                                      | Description                                                 | Category            | DefaultValue |
| ----------------------------------------- | ----------------------------------------------------------- | ------------------- | ------------ |
| ShowAdditions                             | Number of added lines                                       | StaticMeasures      | yes          |
| ShowDeleted                               | Number of deleted lines                                     | StaticMeasures      | yes          |
| ShowNumberOfChangedFiles                  | Number of changed files                                     | StaticMeasures      | yes          |
| ShowNumberOfCommits                       | Number of commits                                           | StaticMeasures      | yes          |
| ShowNumberOfReviews                       | Number of reviews                                           | StaticMeasures      | yes          |
| ShowNumberOfComments                      | Number of comments (w/o review comments)                    | StaticMeasures      | yes          |
| ShowNumberOfCommentOnlyReviews            | Number of reviews that contains a comment to resolve        | StaticMeasures      | yes          |
| ShowNumberOfRequestedChangeReviews        | Number of reviews that requested a change from the author   | StaticMeasures      | yes          |
| ShowNumberOfApprovedReviews               | Number of reviews that approved the Pull Request            | StaticMeasures      | yes          |
| ShowTotalNumberOfParticipants             | Get the total number of participants of a Pull Request      | StaticMeasures      | yes          |
| ShowTimeTotalRuntimeForLastStatusCheckRun | Total runtime for last status check run (Workflow for PR)   | StatusCheckRelated  | yes          |
| ShowTimeSpendOnPrForLastStatusCheckRun    | Total time spend in last status check run on PR             | StatusCheckRelated  | yes          |
| ShowPRLeadTime                            | PR lead time (from creation to close of PR)                 | TimeRelatedMeasures | yes          |
| ShowTimeSpendOnBranchBeforePrCreated      | Time that was spend on the branch before the PR was created | TimeRelatedMeasures | yes          |
| ShowTimeSpendOnBranchBeforePrMerged       | Time that was spend on the branch before the PR was merged  | TimeRelatedMeasures | yes          |
| ShowTimeToMergeAfterLastReview            | Time to merge after last review                             | TimeRelatedMeasures | yes          |