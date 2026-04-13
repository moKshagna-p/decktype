import { t } from 'elysia'

export const usersCountResponseSchema = t.Object({
  count: t.Number(),
})

export const adminUserResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  createdAt: t.String(),
})

export const deleteFeedbackParamsSchema = t.Object({
  id: t.String({ minLength: 1 }),
})

export const deleteFeedbackResponseSchema = t.Object({
  ok: t.Boolean(),
})
