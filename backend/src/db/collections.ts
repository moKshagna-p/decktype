import type { Collection } from 'mongodb'

import { db } from './client'

export type ResultDocument = {
  userId: string
  gameId: string
  score: number
  difficulty: string
  createdAt: Date
}

export type LeaderboardDocument = {
  userId: string
  displayName: string
  gameId: string
  difficulty: string
  bestScore: number
  bestResultAt: Date
}

export type ContributorDocument = {
  githubId: number
  login: string
  displayName: string | null
  avatarUrl: string
  profileUrl: string
  contributions: number
  type: string
  isActive: boolean
  lastSyncedAt: Date
  updatedAt: Date
}

export const resultsCollection: Collection<ResultDocument> =
  db.collection<ResultDocument>('results')

export const leaderboardCollection: Collection<LeaderboardDocument> =
  db.collection<LeaderboardDocument>('leaderboard')

export const contributorsCollection: Collection<ContributorDocument> =
  db.collection<ContributorDocument>('contributors')
