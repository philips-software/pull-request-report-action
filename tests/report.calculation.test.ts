// for license and copyright look at the repository

import { IPullRequest } from '../src/Interfaces/PullRequestTypes'
import { PullRequest } from '../src/PullRequest.Definitions'
import {
  GenerateEventTimeline,
  GetLeadTimeForPullRequest,
  GetNumberOfApprovedReviews,
  GetNumberOfCommentOnlyReviews,
  GetTotalNumberOfParticipants,
  GetNumberOfRequestedChangeReviews,
  GetTimeSpendInPrForLastStatusCheckRun,
  GetTimeSpendOnBranchBeforePRCreated,
  GetTimeSpendOnBranchBeforePRMerged,
  GetTimeToMergeAfterLastReview,
  GetTotalRuntimeForLastStatusCheckRun,
} from '../src/Report.Calculation'
import { DataFromBigPullRequest } from './pr_sample_data'

let PullRequestJsonModel: unknown
let PullRequestStatModel: IPullRequest

const CreatePrCopy = (pr: IPullRequest): IPullRequest => {
  const prAsJson = JSON.stringify(pr)
  return JSON.parse(prAsJson) as IPullRequest
}

const CreatePrCopyWithoutStatusChecks = (pr: IPullRequest): IPullRequest => {
  const prCopy = CreatePrCopy(pr)
  prCopy.statusChecks = []
  return prCopy
}

beforeAll(() => {
  PullRequestJsonModel = DataFromBigPullRequest
  PullRequestStatModel = PullRequest.CreateFromJson(PullRequestJsonModel)
})

test('Check calculation of Pull Request lead time', () => {
  const leadTime = GetLeadTimeForPullRequest(PullRequestStatModel)
  expect(leadTime).toBe(22110891000)
})

test("Check error hanlding of 'Check calculation of Pull Request lead time'", () => {
  const prCopy = CreatePrCopy(PullRequestStatModel)
  prCopy.createdAt = ''
  const leadTime = GetLeadTimeForPullRequest(prCopy)
  expect(leadTime).toBe(0)
})

test('Check event timeline generation', () => {
  const eventTimeline = GenerateEventTimeline(PullRequestStatModel)
  expect(eventTimeline.length).toBeGreaterThan(0)
})

test('Check calculation of "Time spend on branch before PR is created"', () => {
  const timeSpend = GetTimeSpendOnBranchBeforePRCreated(PullRequestStatModel)
  expect(timeSpend).toBeGreaterThan(0)
})

test('Check error handling for "Time spend on branch before PR is created"', () => {
  const prCopy = CreatePrCopy(PullRequestStatModel)
  prCopy.createdAt = ''
  const timeSpend = GetTimeSpendOnBranchBeforePRCreated(prCopy)
  expect(timeSpend).toBe(0)
})

test('Check calculation error handling of "Time spend on branch before PR is merged"', () => {
  const pr = CreatePrCopy(PullRequestStatModel)
  pr.mergedAt = ''
  pr.closedAt = ''
  const timeSpend = GetTimeSpendOnBranchBeforePRMerged(pr)
  expect(timeSpend).toBe(-1)
})

test('Check calculation of "Time to merge after the last review"', () => {
  const timeSpend = GetTimeToMergeAfterLastReview(PullRequestStatModel)
  expect(timeSpend).toBeGreaterThan(0)
})

test('Check error handling of "Time to merge after the last review"', () => {
  let pr = CreatePrCopy(PullRequestStatModel)
  pr.mergedAt = ''
  pr.closedAt = ''
  expect(GetTimeToMergeAfterLastReview(pr)).toBe(-1)
  pr = CreatePrCopy(PullRequestStatModel)
  pr.reviews = []
  expect(GetTimeToMergeAfterLastReview(pr)).toBe(-1)
})

test('Check calculation of "Total runtime for last status check run"', () => {
  const timeSpend = GetTotalRuntimeForLastStatusCheckRun(PullRequestStatModel)
  expect(timeSpend).toBeGreaterThan(0)
})

test('Check empty list handling of "Total runtime for last status check run"', () => {
  const pr = CreatePrCopyWithoutStatusChecks(PullRequestStatModel)
  expect(GetTotalRuntimeForLastStatusCheckRun(pr)).toBe(0)
})

test('Check calculation of "Total time spend in last status check run"', () => {
  const timeSpend = GetTimeSpendInPrForLastStatusCheckRun(PullRequestStatModel)
  expect(timeSpend).toBeGreaterThan(0)
})

test('Check empty list handling of  "Total time spend in last status check run"', () => {
  const pr = CreatePrCopyWithoutStatusChecks(PullRequestStatModel)
  expect(GetTimeSpendInPrForLastStatusCheckRun(pr)).toBe(0)
})

test('Check calculation of "Number of reviews that contains a comment to resolve"', () => {
  const numberOfReviews = GetNumberOfCommentOnlyReviews(PullRequestStatModel)
  expect(numberOfReviews).toBeGreaterThan(0)
})

test('Check calculation of "Number of reviews that contains a comment to resolve (with no comments)"', () => {
  const pr = CreatePrCopy(PullRequestStatModel)
  // check the pr.reviews for all 'COMMENTED' reviews and remove them
  pr.reviews = pr.reviews.filter((review) => review.state !== 'COMMENTED')
  const numberOfReviews = GetNumberOfCommentOnlyReviews(pr)
  expect(numberOfReviews).toBe(0)
})

test('of reviews that contains a comment to resolve (with no comments)"', () => {
  const pr = CreatePrCopy(PullRequestStatModel)
  // check the pr.reviews for all 'COMMENTED' reviews and remove them
  pr.reviews = []
  const numberOfReviews = GetNumberOfCommentOnlyReviews(pr)
  expect(numberOfReviews).toBe(0)
})

test('Check calculation of "Number of reviews that requested a change from the author"', () => {
  const numberOfReviews = GetNumberOfRequestedChangeReviews(PullRequestStatModel)
  expect(numberOfReviews).toBeGreaterThan(0)
})

test('Check calculation of "Number of reviews that requested a change from the author (with no reviews that requires a change)"', () => {
  const pr = CreatePrCopy(PullRequestStatModel)
  // check the pr.reviews for all 'CHANGES_REQUESTED' reviews and remove them
  pr.reviews = pr.reviews.filter((review) => review.state !== 'CHANGES_REQUESTED')
  const numberOfReviews = GetNumberOfRequestedChangeReviews(pr)
  expect(numberOfReviews).toBe(0)
})

test('Check calculation of "Number of reviews that approved the Pull Request"', () => {
  const numberOfReviews = GetNumberOfApprovedReviews(PullRequestStatModel)
  expect(numberOfReviews).toBeGreaterThan(0)
})

test('Check calculation of "Number of reviews that requested a change from the author (with no reviews that approves)"', () => {
  const pr = CreatePrCopy(PullRequestStatModel)
  // check the pr.reviews for all 'APPROVED' reviews and remove them
  pr.reviews = pr.reviews.filter((review) => review.state !== 'APPROVED')
  const numberOfReviews = GetNumberOfApprovedReviews(pr)
  expect(numberOfReviews).toBe(0)
})

test('Get the total number of participants of a Pull Request', () => {
  const numberOfParticipants = GetTotalNumberOfParticipants(PullRequestStatModel)
  expect(numberOfParticipants).toBeGreaterThan(0)
})
