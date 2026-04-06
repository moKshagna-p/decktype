import { contributorsCollection } from '../../db/collections'

export const listActiveContributors = async (limit: number) =>
  contributorsCollection
    .find(
      { isActive: true, type: { $ne: 'Bot' } },
      {
        sort: {
          contributions: -1,
          login: 1,
        },
        limit,
      },
    )
    .toArray()

export const getLatestContributorsSyncAt = async () => {
  const latest = await contributorsCollection.findOne(
    {},
    {
      sort: {
        lastSyncedAt: -1,
      },
      projection: {
        lastSyncedAt: 1,
      },
    },
  )

  return latest?.lastSyncedAt ?? null
}

export const upsertContributors = async (
  contributors: {
    githubId: number
    login: string
    displayName: string | null
    avatarUrl: string
    profileUrl: string
    contributions: number
    type: string
  }[],
  syncedAt: Date,
) => {
  if (contributors.length === 0) {
    return
  }

  await contributorsCollection.bulkWrite(
    contributors.map((contributor) => ({
      updateOne: {
        filter: {
          githubId: contributor.githubId,
        },
        update: {
          $set: {
            login: contributor.login,
            displayName: contributor.displayName,
            avatarUrl: contributor.avatarUrl,
            profileUrl: contributor.profileUrl,
            contributions: contributor.contributions,
            type: contributor.type,
            isActive: true,
            lastSyncedAt: syncedAt,
            updatedAt: syncedAt,
          },
        },
        upsert: true,
      },
    })),
    { ordered: false },
  )
}

export const deactivateMissingContributors = async (
  githubIds: number[],
  syncedAt: Date,
) => {
  const filter =
    githubIds.length > 0
      ? {
          githubId: { $nin: githubIds },
          isActive: true,
        }
      : { isActive: true }

  const result = await contributorsCollection.updateMany(filter, {
    $set: {
      isActive: false,
      updatedAt: syncedAt,
    },
  })

  return result.modifiedCount
}
