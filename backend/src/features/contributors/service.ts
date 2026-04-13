import { ApiError } from '../../lib/errors/api-error'
import { errorCodes } from '../../lib/errors/error-codes'
import { env } from '../../config/env'
import {
  deactivateMissingContributors,
  getLatestContributorsSyncAt,
  listActiveContributors,
  upsertContributors,
} from './repository'
import type { ContributorsResponse } from './schema'

type GitHubContributor = {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

const parseGitHubContributor = (value: unknown): GitHubContributor | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const contributor = value as Record<string, unknown>

  if (
    typeof contributor.id !== 'number' ||
    typeof contributor.login !== 'string' ||
    typeof contributor.avatar_url !== 'string' ||
    typeof contributor.html_url !== 'string' ||
    typeof contributor.contributions !== 'number' ||
    typeof contributor.type !== 'string'
  ) {
    return null
  }

  return {
    id: contributor.id,
    login: contributor.login,
    avatar_url: contributor.avatar_url,
    html_url: contributor.html_url,
    contributions: contributor.contributions,
    type: contributor.type,
  }
}

const fetchGitHubContributorsPage = async (page: number) => {
  const headers = new Headers({
    accept: 'application/vnd.github+json',
    'user-agent': 'decktype-contributors-sync',
  })

  if (env.githubToken) {
    headers.set('authorization', `Bearer ${env.githubToken}`)
  }

  const response = await fetch(
    `https://api.github.com/repos/${env.githubOwner}/${env.githubRepo}/contributors?per_page=100&page=${page}`,
    {
      method: 'GET',
      headers,
    },
  )

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      code: errorCodes.internalServerError,
      message: `Unable to fetch contributors from GitHub (status ${response.status}).`,
    })
  }

  const data = (await response.json()) as unknown

  if (!Array.isArray(data)) {
    throw new ApiError({
      status: 502,
      code: errorCodes.internalServerError,
      message: 'Unexpected GitHub contributors response format.',
    })
  }

  return data
    .map(parseGitHubContributor)
    .filter((contributor): contributor is GitHubContributor => contributor !== null)
}

const fetchAllGitHubContributors = async () => {
  const contributors: GitHubContributor[] = []

  for (let page = 1; page <= 50; page += 1) {
    const currentPage = await fetchGitHubContributorsPage(page)

    if (currentPage.length === 0) {
      break
    }

    contributors.push(...currentPage)

    if (currentPage.length < 100) {
      break
    }
  }

  return contributors
}

export const getContributors = async (limit: number): Promise<ContributorsResponse> => {
  const [contributors, latestSyncAt] = await Promise.all([
    listActiveContributors(limit),
    getLatestContributorsSyncAt(),
  ])

  return {
    contributors: contributors.map((contributor) => ({
      login: contributor.login,
      displayName: contributor.displayName,
      avatarUrl: contributor.avatarUrl,
      profileUrl: contributor.profileUrl,
      contributions: contributor.contributions,
    })),
    syncedAt: latestSyncAt ? latestSyncAt.toISOString() : null,
  }
}

export const syncContributors = async () => {
  const fetchedContributors = await fetchAllGitHubContributors()
  const syncedAt = new Date()
  const contributors = fetchedContributors.map((contributor) => ({
    githubId: contributor.id,
    login: contributor.login,
    displayName: null,
    avatarUrl: contributor.avatar_url,
    profileUrl: contributor.html_url,
    contributions: contributor.contributions,
    type: contributor.type,
  }))

  await upsertContributors(contributors, syncedAt)

  const deactivatedCount = await deactivateMissingContributors(
    contributors.map((contributor) => contributor.githubId),
    syncedAt,
  )

  return {
    fetchedCount: fetchedContributors.length,
    syncedCount: contributors.length,
    deactivatedCount,
    syncedAt: syncedAt.toISOString(),
  }
}
