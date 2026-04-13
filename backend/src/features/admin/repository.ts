import { ObjectId } from 'mongodb'

import { db } from '../../db/client'
import { feedbackCollection } from '../../db/collections'

type AuthUserDocument = {
  _id: ObjectId
  name?: string | null
  email?: string | null
  createdAt?: Date | string | null
}

const usersCollection = db.collection<AuthUserDocument>('user')

const toCreatedAtIso = (value: AuthUserDocument['createdAt']) => {
  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'string') {
    const date = new Date(value)

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }

  return ''
}

export const countUsers = async () => {
  return usersCollection.countDocuments()
}

export const listUsers = async (limit = 500) => {
  const docs = await usersCollection
    .find({}, { projection: { name: 1, email: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name?.trim() || 'unknown',
    email: doc.email?.trim() || 'unknown',
    createdAt: toCreatedAtIso(doc.createdAt),
  }))
}

export const deleteFeedbackById = async (id: string) => {
  const result = await feedbackCollection.deleteOne({ _id: new ObjectId(id) })

  return result.deletedCount > 0
}
