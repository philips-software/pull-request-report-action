// for license and copyright look at the repository

import { IPullRequest } from '../src/Interfaces/PullRequestTypes'
import { PullRequest } from '../src/PullRequest.Definitions'
import {
  GetAddedLines,
  GetChangedFilesCount,
  GetCommentCount,
  GetCommitsCount,
  GetDeletedLines,
} from '../src/Report.Functions'
import { DataFromBigPullRequest } from './pr_sample_data'

let PullRequestJsonModel: unknown
let PullRequestStatModel: IPullRequest

beforeAll(() => {
  PullRequestJsonModel = DataFromBigPullRequest
  PullRequestStatModel = PullRequest.CreateFromJson(PullRequestJsonModel)
})

test('Check number of added lines', () => {
  const additions = DataFromBigPullRequest as { additions: number }
  expect(GetAddedLines(PullRequestStatModel)).toBe(additions['additions'])
})

test('Check number of deleted lines', () => {
  const deletions = DataFromBigPullRequest as { deletions: number }
  expect(GetDeletedLines(PullRequestStatModel)).toBe(deletions['deletions'])
})

test('Check number changed files', () => {
  const changedFiles = DataFromBigPullRequest as { changedFiles: number }
  expect(GetChangedFilesCount(PullRequestStatModel)).toBe(changedFiles['changedFiles'])
})

test('Check number commits', () => {
  const commits = DataFromBigPullRequest as { commits: unknown[] }
  expect(GetCommitsCount(PullRequestStatModel)).toBe(commits['commits'].length)
})

test('Check number comments', () => {
  const comments = DataFromBigPullRequest as { comments: unknown[] }
  expect(GetCommentCount(PullRequestStatModel)).toBe(comments['comments'].length)
})
