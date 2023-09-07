// for license and copyright look at the repository

import { DataFromBigPullRequest } from './pr_sample_data'
import { PullRequest } from '../src/PullRequest.Definitions'
import {
  IPullRequestComment,
  IPullRequestCommit,
  IPullRequestReview,
  IStatusCheck,
} from '../src/Interfaces/PullRequestTypes'

// This method can be used to update the sample data
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const UpdateSampleData = async () => {
//   const prData = await GetPullRequestData(381, 'aertslab/SCope')
//   // write json to file
//   fs.writeFileSync('prDatams.json', JSON.stringify(prData, null, 2))
// }

// test('Gather PR-Data for unknown Repo', async () => {
//   let exceptionRaised = false
//   try {
//     const jsonData = await GetPullRequestData(381, 'aertslab437598493-qn/SCope-154d7884f5')
//     const data = PullRequest.CreateFromJson(jsonData)
//     console.log(data)
//   } catch (e) {
//     exceptionRaised = true
//   }
//   expect(exceptionRaised).toBeTruthy()
// }, 15000)

test('Transfer to internal object model', () => {
  const data = PullRequest.CreateFromJson(DataFromBigPullRequest)
  expect(data).toBeDefined()
})

test('Check if DataFromBigPullRequest is parsed correctly and reflected by the object model consistently', () => {
  const SampleData = DataFromBigPullRequest as {
    number: number
    title: string
    createdAt: string
    updatedAt: string
    closedAt: string
    mergedAt: string
    body: string
    author: string
    state: string
    mergeable: string
    mergeStateStatus: string
    isDraft: boolean
    baseRefName: string
    headRefName: string
    headRefOid: string
    headRepository: string
    headRepositoryOwner: string
    commits: unknown[]
    reviews: unknown[]
    comments: unknown[]
    statusCheckRollup: unknown[]
  }
  // parse data from DataFromBigPullRequest
  const data = PullRequest.CreateFromJson(DataFromBigPullRequest)
  // check if the data is parsed correctly
  expect(data.id).toBe(SampleData['number'])
  expect(data.title).toBe(SampleData['title'])
  expect(data.createdAt).toBe(SampleData['createdAt'])
  expect(data.updatedAt).toBe(SampleData['updatedAt'])
  expect(data.closedAt).toBe(SampleData['closedAt'])
  expect(data.mergedAt).toBe(SampleData['mergedAt'])
  expect(data.body).toBe(SampleData['body'])
  expect(data.author).toBe(SampleData['author'])
  expect(data.state).toBe(SampleData['state'])
  expect(data.mergeable).toBe(SampleData['mergeable'])
  expect(data.mergeStateStatus).toBe(SampleData['mergeStateStatus'])
  expect(data.isDraft).toBe(SampleData['isDraft'])
  expect(data.baseRefName).toBe(SampleData['baseRefName'])
  expect(data.headRefName).toBe(SampleData['headRefName'])
  expect(data.headRefOid).toBe(SampleData['headRefOid'])
  expect(data.headRepository).toBe(SampleData['headRepository'])
  expect(data.headRepositoryOwner).toBe(SampleData['headRepositoryOwner'])

  expect(data.commits.length).toBe(SampleData['commits'].length)
  expect(data.reviews.length).toBe(SampleData['reviews'].length)
  expect(data.comments.length).toBe(SampleData['comments'].length)
  expect(data.statusChecks.length).toBe(SampleData['statusCheckRollup'].length)
  CheckCommits(data.commits, 1)
  CheckReviews(data.reviews, 0)
  CheckComments(data.comments, 1)
  CheckStatusChecks(data.statusChecks, 1)
})

const CheckStatusChecks = (checks: IStatusCheck[], index: number) => {
  const SampleData = DataFromBigPullRequest as { statusCheckRollup: unknown[] }
  expect(checks.length).toBe(SampleData['statusCheckRollup'].length)
  const statusCheck = checks[index]
  const statusCheckFromSampleData = SampleData['statusCheckRollup'][index] as {
    completedAt: string
    conclusion: string
    name: string
    startedAt: string
    status: string
    workflowName: string
  }
  expect(statusCheck.completedAt).toBe(statusCheckFromSampleData['completedAt'])
  expect(statusCheck.conclusion).toBe(statusCheckFromSampleData['conclusion'])
  expect(statusCheck.name).toBe(statusCheckFromSampleData['name'])
  expect(statusCheck.startedAt).toBe(statusCheckFromSampleData['startedAt'])
  expect(statusCheck.status).toBe(statusCheckFromSampleData['status'])
  expect(statusCheck.workflowName).toBe(statusCheckFromSampleData['workflowName'])
}

const CheckComments = (comments: IPullRequestComment[], index: number) => {
  const SampleData = DataFromBigPullRequest as { comments: unknown[] }
  expect(comments.length).toBe(SampleData['comments'].length)

  const comment = comments[index]
  const commentFromSampleData = SampleData['comments'][index] as {
    author: { login: string }
    authorAssociation: string
    body: string
    createdAt: string
    id: string
    url: string
    viewerDidAuthor: string
  }
  expect(comment.authorAssociation).toBe(commentFromSampleData['authorAssociation'])
  expect(comment.authorLogin).toBe(commentFromSampleData['author']['login'])
  expect(comment.body).toBe(commentFromSampleData['body'])
  expect(comment.createdAt).toBe(commentFromSampleData['createdAt'])
  expect(comment.id).toBe(commentFromSampleData['id'])
  expect(comment.url).toBe(commentFromSampleData['url'])
  expect(comment.viewerDidAuthor).toBe(commentFromSampleData['viewerDidAuthor'] == 'true')
}

const CheckCommits = (commits: IPullRequestCommit[], index: number) => {
  const SampleData = DataFromBigPullRequest as { commits: unknown[] }
  expect(commits.length).toBe(SampleData['commits'].length)

  const commit = commits[index]
  const commitFromSampleData = SampleData['commits'][index] as {
    oid: string
    messageHeadline: string
    messageBody: string
    authors: { email: string; name: string; login: string; id: string }[]
  }
  const authorIndex = 0
  expect(commit.commitId).toBe(commitFromSampleData['oid'])
  expect(commit.commitHeader).toBe(commitFromSampleData['messageHeadline'])
  expect(commit.commitBody).toBe(commitFromSampleData['messageBody'])
  expect(commit.authors[authorIndex].email).toBe(commitFromSampleData['authors'][authorIndex]['email'])
  expect(commit.authors[authorIndex].name).toBe(commitFromSampleData['authors'][authorIndex]['name'])
  expect(commit.authors[authorIndex].login).toBe(commitFromSampleData['authors'][authorIndex]['login'])
  expect(commit.authors[authorIndex].id).toBe(commitFromSampleData['authors'][authorIndex]['id'])
}

const CheckReviews = (reviews: IPullRequestReview[], index: number) => {
  const SampleData = DataFromBigPullRequest as { reviews: unknown[] }
  expect(reviews.length).toBe(SampleData['reviews'].length)

  const review = reviews[index]
  const reviewFromSampleData = SampleData['reviews'][0] as {
    author: { login: string }
    body: string
    state: string
    submittedAt: string
  }
  expect(review.authorLogin).toBe(reviewFromSampleData['author']['login'])
  expect(review.body).toBe(reviewFromSampleData['body'])
  expect(review.state).toBe(reviewFromSampleData['state'])
  expect(review.submittedAt).toBe(reviewFromSampleData['submittedAt'])
}
