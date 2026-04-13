import type { CreateFeedbackInput, VoteFeedbackInput } from './schema'
import * as repository from './repository'

export const submitFeedback = async (input: CreateFeedbackInput) => {
  return repository.createFeedbackEntry({
    content: input.content,
    userId: input.userId,
    userDisplayName: input.userDisplayName,
    upvotedBy: [],
    downvotedBy: [],
    createdAt: new Date(),
  })
}

export const listFeedback = async () => {
  return repository.getFeedbackEntries(50)
}

export const upvoteFeedback = async (input: VoteFeedbackInput) => {
  return repository.upvoteFeedbackEntry(input.feedbackId, input.userId)
}

export const downvoteFeedback = async (input: VoteFeedbackInput) => {
  return repository.downvoteFeedbackEntry(input.feedbackId, input.userId)
}
