import { t } from 'elysia'

export type ContributorResponse = {
  login: string
  displayName: string | null
  avatarUrl: string
  profileUrl: string
  contributions: number
}

export type ContributorsResponse = {
  contributors: ContributorResponse[]
  syncedAt: string | null
}

export const contributorsQuerySchema = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 200, default: 100 })),
})

export const contributorResponseSchema = t.Object({
  login: t.String(),
  displayName: t.Union([t.String(), t.Null()]),
  avatarUrl: t.String(),
  profileUrl: t.String(),
  contributions: t.Number(),
})

export const contributorsResponseSchema = t.Object({
  contributors: t.Array(contributorResponseSchema),
  syncedAt: t.Union([t.String(), t.Null()]),
})

export const syncContributorsResponseSchema = t.Object({
  fetchedCount: t.Number(),
  syncedCount: t.Number(),
  deactivatedCount: t.Number(),
  syncedAt: t.String(),
})
