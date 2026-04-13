import { t } from 'elysia'

export type CreateFeedbackInput = {
  content: string
  userId: string
  userDisplayName: string
}

export type VoteFeedbackInput = {
  feedbackId: string
  userId: string
}

export const createFeedbackBodySchema = t.Object({
  content: t.String({ minLength: 1, maxLength: 2000 }),
})

export const feedbackResponseSchema = t.Object({
  id: t.String(),
  content: t.String(),
  userId: t.String(),
  userDisplayName: t.String(),
  upvotedBy: t.Array(t.String()),
  downvotedBy: t.Array(t.String()),
  createdAt: t.Date(),
})
