// for license and copyright look at the repository

import {
  IPullRequest,
  IPullRequestComment,
  IPullRequestCommit,
  IPullRequestReview,
} from './Interfaces/PullRequestTypes'
import { EventWithTime } from './Interfaces/ReportTypes'
import { StatusCheck } from './PullRequest.Definitions'

export const GenerateEventTimeline = (pullRequest: IPullRequest): EventWithTime[] => {
  const events: EventWithTime[][] = []

  // merge all interesting events into a single list
  events.push([
    { type: 'createAt', date: new Date(pullRequest.createdAt), event_instance: pullRequest.createdAt, time: 0 },
  ])
  events.push(
    pullRequest.commits.map((commit) => ({
      type: 'commit',
      date: new Date(commit.authorDate),
      event_instance: commit,
      time: 0,
    }))
  )
  events.push(
    pullRequest.reviews.map((review) => ({
      type: 'review',
      date: new Date(review.submittedAt),
      event_instance: review,
      time: 0,
    }))
  )
  events.push(
    pullRequest.statusChecks.map((statusCheck) => ({
      type: 'statusCheck',
      date: new Date(statusCheck.completedAt),
      event_instance: statusCheck,
      time: 0,
    }))
  )
  events.push(
    pullRequest.comments.map((comment) => ({
      type: 'comment',
      date: new Date(comment.createdAt),
      event_instance: comment,
      time: 0,
    }))
  )
  events.push([
    { type: 'mergedAt', date: new Date(pullRequest.mergedAt), event_instance: pullRequest.mergedAt, time: 0 },
  ])
  events.push([
    { type: 'closedAt', date: new Date(pullRequest.closedAt), event_instance: pullRequest.closedAt, time: 0 },
  ])

  // flatten the list
  const flattenedEvents = events.flat()

  // filter out events that don't have a valid date
  const filteredEvents = flattenedEvents.filter((event) => event.date !== null)

  // sort the events by date
  filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

  // now, create a list of events with the time between events
  const eventsWithTime: EventWithTime[] = []

  // calculate the time between events
  for (let i = 0; i < filteredEvents.length; i++) {
    if (i === 0) {
      eventsWithTime.push({
        type: filteredEvents[i].type,
        date: filteredEvents[i].date,
        time: 0,
        event_instance: filteredEvents[i].event_instance,
      })
    } else {
      eventsWithTime.push({
        type: filteredEvents[i].type,
        date: filteredEvents[i].date,
        time: (filteredEvents[i].date.getTime() - filteredEvents[i - 1].date.getTime()) / 1000,
        event_instance: filteredEvents[i].event_instance,
      })
    }
  }

  return eventsWithTime
}

export const MillisecondsToReadableDuration = (leadTimeInMSec: number) => {
  const seconds = +(leadTimeInMSec / 1000).toFixed(1)
  const minutes = +(leadTimeInMSec / (1000 * 60)).toFixed(1)
  const hours = +(leadTimeInMSec / (1000 * 60 * 60)).toFixed(1)
  const days = +(leadTimeInMSec / (1000 * 60 * 60 * 24)).toFixed(1)
  if (seconds < 60) return `${seconds} Sec`
  else if (minutes < 60) return `${minutes} Min`
  else if (hours < 24) return `${hours} Hours`
  else return `${days} Days`
}

export const GetMergedOrClosedDate = (pullRequest: IPullRequest): string => {
  let mergedOrClosedAt = pullRequest.mergedAt

  if (mergedOrClosedAt == null) mergedOrClosedAt = pullRequest.closedAt

  return mergedOrClosedAt
}

export const GetLeadTimeForPullRequest = (pullRequest: IPullRequest) => {
  // parse createAt as date from string
  const createAt = new Date(pullRequest.createdAt)
  const mergedOrClosedAt = new Date(GetMergedOrClosedDate(pullRequest))

  const duration = mergedOrClosedAt.getTime() - createAt.getTime()
  if (duration <= 0 || isNaN(duration)) return 0

  return duration
}

export const GetTimeSpendOnBranchBeforePRCreated = (pullRequest: IPullRequest) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const createAtEvent = eventTimeline.find((event) => event.type === 'createAt')
  const firstCommitEvent = eventTimeline.find((event) => event.type === 'commit')

  if (!createAtEvent || !firstCommitEvent) return 0

  const duration = createAtEvent.date.getTime() - firstCommitEvent.date.getTime()
  if (duration <= 0 || isNaN(duration)) return 0

  return duration
}

export const GetTimeSpendOnBranchBeforePRMerged = (pullRequest: IPullRequest) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const mergedAtEvent = eventTimeline.find((event) => event.type === 'mergedAt')
  const firstCommitEvent = eventTimeline.find((event) => event.type === 'commit')

  if (mergedAtEvent && firstCommitEvent && mergedAtEvent.date.getTime() > firstCommitEvent.date.getTime()) {
    return mergedAtEvent.date.getTime() - firstCommitEvent.date.getTime()
  }

  return -1
}

export const GetTimeToMergeAfterLastReview = (pullRequest: IPullRequest) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const mergedAtEvent = eventTimeline.find((event) => event.type === 'mergedAt')
  const reviewEvents = eventTimeline.filter((event) => event.type === 'review')

  if (reviewEvents.length <= 0) {
    return -1
  }

  const lastReviewEvent = reviewEvents.reverse()[0]
  if (mergedAtEvent && lastReviewEvent && mergedAtEvent.date.getTime() > lastReviewEvent.date.getTime()) {
    return mergedAtEvent.date.getTime() - lastReviewEvent.date.getTime()
  }

  return -1
}

export const GetTotalRuntimeForLastStatusCheckRun = (pullRequest: IPullRequest) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const statusCheckEvents = eventTimeline
    .filter((event) => event.type === 'statusCheck')
    .map((event) => event.event_instance as StatusCheck)
    .filter((statusCheck) => statusCheck.status == 'COMPLETED')

  if (statusCheckEvents.length <= 0) {
    return 0
  }

  let totalTime = 0
  statusCheckEvents.forEach((statusCheck) => {
    totalTime += new Date(statusCheck.completedAt).getTime() - new Date(statusCheck.startedAt).getTime()
  })

  return totalTime
}

export const GetTimeSpendInPrForLastStatusCheckRun = (pullRequest: IPullRequest) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const statusCheckEvents = eventTimeline
    .filter((event) => event.type === 'statusCheck')
    .map((event) => event.event_instance as StatusCheck)
    .filter((statusCheck) => statusCheck.status == 'COMPLETED')

  if (statusCheckEvents.length <= 0) {
    return 0
  }

  let earliestStart = new Date()
  let latestCompletion = new Date(0, 0, 0)
  statusCheckEvents.forEach((statusCheckEvent) => {
    const completedDate = new Date(statusCheckEvent.completedAt)
    const startedDate = new Date(statusCheckEvent.startedAt)
    if (startedDate < earliestStart) {
      earliestStart = startedDate
    }
    if (completedDate > latestCompletion) {
      latestCompletion = completedDate
    }
  })

  return latestCompletion.getTime() - earliestStart.getTime()
}

const FilterReviewsByState = (pullRequest: IPullRequest, state: string) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const reviewEvents = eventTimeline.filter((event) => event.type === 'review')

  if (reviewEvents.length <= 0) {
    return []
  }

  const filteredReviews = reviewEvents.filter((reviewEvent) => {
    const review = reviewEvent.event_instance as IPullRequestReview
    return review.state === state
  })

  return filteredReviews
}

export const GetNumberOfCommentOnlyReviews = (pullRequest: IPullRequest) => {
  return FilterReviewsByState(pullRequest, 'COMMENTED').length
}

export const GetNumberOfRequestedChangeReviews = (pullRequest: IPullRequest) => {
  return FilterReviewsByState(pullRequest, 'CHANGES_REQUESTED').length
}

export const GetNumberOfApprovedReviews = (pullRequest: IPullRequest) => {
  return FilterReviewsByState(pullRequest, 'APPROVED').length
}

export const GetUniqueReviewParticipants = (pullRequest: IPullRequest) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const reviewEvents = eventTimeline.filter((event) => event.type === 'review')
  // extract unique reviewers from review events
  return reviewEvents
    .map((reviewEvent) => reviewEvent.event_instance as IPullRequestReview)
    .map((review) => review.authorLogin)
    .filter((value, index, self) => self.indexOf(value) === index)
}

export const GetUniqueCommentParticipants = (pullRequest: IPullRequest) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const commentEvents = eventTimeline.filter((event) => event.type === 'comment')

  // extract unique commenter from review events
  return commentEvents
    .map((commentEvent) => commentEvent.event_instance as IPullRequestComment)
    .map((comment) => comment.authorLogin)
    .filter((value, index, self) => self.indexOf(value) === index)
}

export const GetUniqueCommitterParticipants = (pullRequest: IPullRequest) => {
  const eventTimeline = GenerateEventTimeline(pullRequest)
  const commitEvents = eventTimeline.filter((event) => event.type === 'commit')

  // extract unique reviewers from review events
  return commitEvents
    .map((commitEvent) => commitEvent.event_instance as IPullRequestCommit)
    .map((commit) => commit.authors.filter((author) => author.login !== null).map((author) => author.login))
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)
}

export const GetNumberOfActivePullRequestReviewParticipants = (pullRequest: IPullRequest) => {
  const uniqueReviewers = GetUniqueReviewParticipants(pullRequest)
  const uniqueCommenter = GetUniqueCommentParticipants(pullRequest)
  return uniqueReviewers.concat(uniqueCommenter).filter((value, index, self) => self.indexOf(value) === index).length
}

export const GetNumberOfPullRequestCommitter = (pullRequest: IPullRequest) => {
  return GetUniqueCommitterParticipants(pullRequest).length
}

export const GetTotalNumberOfParticipants = (pullRequest: IPullRequest) => {
  return GetNumberOfActivePullRequestReviewParticipants(pullRequest) + GetNumberOfPullRequestCommitter(pullRequest)
}
