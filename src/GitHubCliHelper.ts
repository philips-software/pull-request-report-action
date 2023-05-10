// for license and copyright look at the repository

// use util to make exec a promise
import * as util from 'util'
import { exec } from 'child_process'

const execAsync = util.promisify(exec)
const gh_cli_arguments = `--json "additions,assignees,author,baseRefName,body,changedFiles,closed,closedAt,comments,commits,createdAt,deletions,files,headRefName,headRefOid,headRepository,headRepositoryOwner,id,isCrossRepository,isDraft,labels,latestReviews,maintainerCanModify,mergeCommit,mergeStateStatus,mergeable,mergedAt,mergedBy,milestone,number,potentialMergeCommit,projectCards,projectItems,reactionGroups,reviewDecision,reviewRequests,reviews,state,statusCheckRollup,title,updatedAt,url"`

export const GetPullRequestData = async (pullRequestNumber: number, repo = ''): Promise<unknown> => {
  let pullRequestData = undefined
  let repoName = ''
  if (repo !== '') {
    repoName = `--repo ${repo}`
  }

  const ghCliCommand = `gh pr view ${pullRequestNumber} ${gh_cli_arguments} ${repoName}`
  const { stdout, stderr } = await execAsync(ghCliCommand)
  if (stdout === ``) {
    throw new Error(`No data returned from GitHub CLI. Command: ${ghCliCommand} \n Stderr: ${stderr}`)
  }
  pullRequestData = stdout
  return JSON.parse(pullRequestData) as unknown
}

export const AddCommentToPR = async (commentFile: string, prNumber: number): Promise<void> => {
  const ghCliCommand = `gh pr comment ${prNumber} --body-file ${commentFile}`
  const { stdout, stderr } = await execAsync(ghCliCommand)
  if (stdout === ``) {
    throw new Error(`No data returned from GitHub CLI. Command: ${ghCliCommand} \n Stderr: ${stderr}`)
  }
}
