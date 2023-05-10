// for license and copyright look at the repository

import { IPullRequest } from './Interfaces/PullRequestTypes'

export const GetAddedLines = (pr: IPullRequest): number => {
  return pr.fileChangeSummary.additions
}

export const GetDeletedLines = (pr: IPullRequest): number => {
  return pr.fileChangeSummary.deletions
}

export const GetChangedFilesCount = (pr: IPullRequest): number => {
  return pr.fileChangeSummary.changedFilesList
}

export const GetCommitsCount = (pr: IPullRequest): number => {
  return pr.fileChangeSummary.commits
}

export const GetReviewCount = (pr: IPullRequest): number => {
  return pr.reviews.length
}

export const GetCommentCount = (pr: IPullRequest): number => {
  return pr.comments.length
}
