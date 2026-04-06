import { Elysia, t } from 'elysia'

import {
  contributorsQuerySchema,
  contributorsResponseSchema,
  syncContributorsResponseSchema,
} from './schema'
import { getContributors, syncContributors } from './service'

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
    async ({ headers }) =>
      syncContributors(headers['x-sync-secret']),
    {
      headers: t.Object({
        'x-sync-secret': t.String({ minLength: 1 }),
      }),
      response: syncContributorsResponseSchema,
    },
  )
