// for license and copyright look at the repository

import {
  type IPullRequest,
  type IFileChangeSummary,
  type IPullRequestComment,
  type IPullRequestCommit,
  type IPullRequestReview,
  type IStatusCheck,
  ICommitAuthor,
} from './Interfaces/PullRequestTypes'

export class FileChangeSummary implements IFileChangeSummary {
  public additions = 0
  public deletions = 0
  public commits = 0
  public changedFilesList = 0
  public static CreateFromJson(json: unknown): IFileChangeSummary {
    const jsonObject = json as { additions: number; deletions: number; commits: object[]; changedFiles: number }
    const summary = new FileChangeSummary()
    summary.additions = jsonObject['additions']
    summary.deletions = jsonObject['deletions']
    summary.commits = jsonObject['commits'].length
    summary.changedFilesList = jsonObject['changedFiles']
    return summary
  }
}

export class PullRequestReview implements IPullRequestReview {
  public authorLogin = ''
  public state = ''
  public submittedAt = ''
  public body = ''
  public static CreateFromJson(json: unknown): IPullRequestReview {
    const jsonObject = json as { author: { login: string }; state: string; submittedAt: string; body: string }
    const review = new PullRequestReview()
    review.authorLogin = jsonObject['author']['login']
    review.state = jsonObject['state']
    review.submittedAt = jsonObject['submittedAt']
    review.body = jsonObject['body']
    return review
  }
}

export class PullRequestComment implements IPullRequestComment {
  public authorLogin = ''
  public createdAt = ''
  public body = ''
  public authorAssociation = ''
  public id = ''
  public url = ''
  public viewerDidAuthor = false

  public static CreateFromJson(json: unknown): IPullRequestComment {
    const jsonObject = json as {
      author: { login: string }
      createdAt: string
      body: string
      authorAssociation: string
      id: string
      url: string
      viewerDidAuthor: boolean
    }
    const comment = new PullRequestComment()
    comment.authorLogin = jsonObject['author']['login']
    comment.createdAt = jsonObject['createdAt']
    comment.body = jsonObject['body']
    comment.authorAssociation = jsonObject['authorAssociation']
    comment.id = jsonObject['id']
    comment.url = jsonObject['url']
    comment.viewerDidAuthor = jsonObject['viewerDidAuthor']
    return comment
  }
}

function ParseArrayOfType<T>(array: unknown[], cb: (wa: unknown) => T): T[] {
  const parsedArray: T[] = []
  for (const item of array) {
    parsedArray.push(cb(item))
  }
  return parsedArray
}

export class CommitAuthor implements ICommitAuthor {
  public email = ''
  public name = ''
  public login = ''
  public id = ''
  public static CreateFromJson(json: unknown): ICommitAuthor {
    const jsonObject = json as { email: string; name: string; login: string; id: string }
    const author = new CommitAuthor()
    author.email = jsonObject['email']
    author.name = jsonObject['name']
    author.login = jsonObject['login']
    author.id = jsonObject['id']
    return author
  }
}

export class PullRequestCommit implements IPullRequestCommit {
  public authors: ICommitAuthor[] = []
  public committer = ''
  public authorDate = ''
  public commitDate = ''
  public commitHeader = ''
  public commitBody = ''
  public commitId = ''
  public static CreateFromJson(json: unknown): IPullRequestCommit {
    const jsonObject = json as {
      authoredDate: string
      authors: unknown[]
      committedDate: string
      messageHeadline: string
      messageBody: string
      oid: string
    }
    const commit = new PullRequestCommit()
    commit.authorDate = jsonObject['authoredDate']
    // eslint-disable-next-line @typescript-eslint/unbound-method
    commit.authors = ParseArrayOfType<ICommitAuthor>(jsonObject['authors'], CommitAuthor.CreateFromJson)
    commit.commitDate = jsonObject['committedDate']
    commit.commitHeader = jsonObject['messageHeadline']
    commit.commitBody = jsonObject['messageBody']
    commit.commitId = jsonObject['oid']

    return commit
  }
}

export class StatusCheck implements IStatusCheck {
  public workflowName = ''
  public startedAt = ''
  public completedAt = ''
  public conclusion = ''
  public status = ''
  public name = ''
  public detailsUrl = ''
  public static CreateFromJson(json: unknown): IStatusCheck {
    const jsonObject = json as {
      workflowName: string
      startedAt: string
      completedAt: string
      conclusion: string
      status: string
      name: string
      detailsUrl: string
    }
    const statusCheck = new StatusCheck()
    statusCheck.workflowName = jsonObject['workflowName']
    statusCheck.startedAt = jsonObject['startedAt']
    statusCheck.completedAt = jsonObject['completedAt']
    statusCheck.conclusion = jsonObject['conclusion']
    statusCheck.status = jsonObject['status']
    statusCheck.name = jsonObject['name']
    return statusCheck
  }
}

export class PullRequest implements IPullRequest {
  public id = 0
  public title = ''
  public createdAt = ''
  public updatedAt = ''
  public closedAt = ''
  public mergedAt = ''
  public body = ''
  public author = ''
  public state = ''
  public mergeable = ''
  public mergeStateStatus = ''
  public isDraft = false
  public baseRefName = ''
  public headRefName = ''
  public headRefOid = ''
  public headRepository = ''
  public headRepositoryOwner = ''
  public commits: IPullRequestCommit[] = []
  public reviews: IPullRequestReview[] = []
  public comments: IPullRequestComment[] = []
  public statusChecks: IStatusCheck[] = []
  public fileChangeSummary: IFileChangeSummary = new FileChangeSummary()

  public static CreateFromJson(cliPullRequest: unknown): IPullRequest {
    const cliPullRequestObject = cliPullRequest as {
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
      fileChangeSummary: unknown
    }
    const pr = new PullRequest()
    pr.id = cliPullRequestObject['number']
    pr.title = cliPullRequestObject['title']
    pr.createdAt = cliPullRequestObject['createdAt']
    pr.updatedAt = cliPullRequestObject['updatedAt']
    pr.closedAt = cliPullRequestObject['closedAt']
    pr.mergedAt = cliPullRequestObject['mergedAt']
    pr.body = cliPullRequestObject['body']
    pr.author = cliPullRequestObject['author']
    pr.state = cliPullRequestObject['state']
    pr.mergeable = cliPullRequestObject['mergeable']
    pr.mergeStateStatus = cliPullRequestObject['mergeStateStatus']
    pr.isDraft = cliPullRequestObject['isDraft']
    pr.baseRefName = cliPullRequestObject['baseRefName']
    pr.headRefName = cliPullRequestObject['headRefName']
    pr.headRefOid = cliPullRequestObject['headRefOid']
    pr.headRepository = cliPullRequestObject['headRepository']
    pr.headRepositoryOwner = cliPullRequestObject['headRepositoryOwner']

    pr.commits = ParseArrayOfType<IPullRequestCommit>(cliPullRequestObject['commits'], (commit) =>
      PullRequestCommit.CreateFromJson(commit)
    )
    pr.reviews = ParseArrayOfType<IPullRequestReview>(cliPullRequestObject['reviews'], (review) =>
      PullRequestReview.CreateFromJson(review)
    )
    pr.comments = ParseArrayOfType<IPullRequestComment>(cliPullRequestObject['comments'], (comment) =>
      PullRequestComment.CreateFromJson(comment)
    )
    pr.statusChecks = ParseArrayOfType<IStatusCheck>(cliPullRequestObject['statusCheckRollup'], (statusCheck) =>
      StatusCheck.CreateFromJson(statusCheck)
    )
    pr.fileChangeSummary = FileChangeSummary.CreateFromJson(cliPullRequestObject)
    return pr
  }
}
