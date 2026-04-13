export type Feedback = {
  id: string
  content: string
  userId: string
  userDisplayName: string
  upvotedBy: string[]
  downvotedBy: string[]
  createdAt: string
}

export type CreateFeedbackInput = {
  content: string
}
