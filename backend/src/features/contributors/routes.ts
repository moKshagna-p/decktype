import { Elysia } from 'elysia'

import {
  contributorsQuerySchema,
  contributorsResponseSchema,
  syncContributorsResponseSchema,
} from './schema'
import { getContributors, syncContributors } from './service'
import { requireAdminSession } from '../auth/session'

export const contributorRoutes = new Elysia()
  .get(
    '/api/contributors',
    async ({ query }) =>
      getContributors(query.limit ?? 100),
    {
      query: contributorsQuerySchema,
      response: contributorsResponseSchema,
    },
  )
  .post(
    '/api/admin/contributors/sync',
    async ({ request: { headers } }) => {
      await requireAdminSession(headers)

      return syncContributors()
    },
    {
      response: syncContributorsResponseSchema,
    },
  )
