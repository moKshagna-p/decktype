import { api, request } from '@/lib/api-client'
import type { CreateFeedbackInput } from './contract'

export const feedbackKeys = {
  all: ['feedback'] as const,
}

export const feedbackQueryOptions = () => ({
  queryKey: feedbackKeys.all,
  queryFn: () => request(api.feedback.get()),
})

export const createFeedbackMutationOptions = () => ({
  mutationFn: (input: CreateFeedbackInput) =>
    request(api.feedback.post(input)),
})

export const upvoteFeedbackMutationOptions = () => ({
  mutationFn: (id: string) =>
    request(api.feedback[id].upvote.post()),
})

export const downvoteFeedbackMutationOptions = () => ({
  mutationFn: (id: string) =>
    request(api.feedback[id].downvote.post()),
})
