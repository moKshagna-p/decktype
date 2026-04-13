import { Elysia, t } from 'elysia'

import { requireAdminSession } from '../auth/session'
import {
  adminUserResponseSchema,
  deleteFeedbackParamsSchema,
  deleteFeedbackResponseSchema,
  usersCountResponseSchema,
} from './schema'
import { getUsersCount, getUsersList, removeFeedback } from './service'

export const adminRoutes = new Elysia({ prefix: '/api/admin' })
  .get(
    '/users/count',
    async ({ request: { headers } }) => {
      await requireAdminSession(headers)

      return getUsersCount()
    },
    {
      response: usersCountResponseSchema,
    },
  )
  .get(
    '/users',
    async ({ request: { headers } }) => {
      await requireAdminSession(headers)

      return getUsersList()
    },
    {
      response: t.Array(adminUserResponseSchema),
    },
  )
  .delete(
    '/feedback/:id',
    async ({ params, request: { headers } }) => {
      await requireAdminSession(headers)

      return removeFeedback(params.id)
    },
    {
      params: deleteFeedbackParamsSchema,
      response: deleteFeedbackResponseSchema,
    },
  )
