import type { Feedback } from '@/features/feedback/api/contract'

export type AdminUsersCount = {
  count: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type DeleteFeedbackResponse = {
  ok: boolean
}

export type AdminFeedback = Feedback
