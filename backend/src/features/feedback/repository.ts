import { ObjectId } from 'mongodb'
import type { FeedbackDocument } from '../../db/collections'
import { feedbackCollection } from '../../db/collections'

export const createFeedbackEntry = async (data: FeedbackDocument) => {
  const result = await feedbackCollection.insertOne(data)

  return {
    id: result.insertedId.toString(),
    ...data,
  }
}

export const getFeedbackEntries = async (limit = 50) => {
  const cursor = feedbackCollection.find().sort({ createdAt: -1 }).limit(limit)
  const docs = await cursor.toArray()
  
  return docs.map((doc) => {
    const { _id, ...rest } = doc as any
    return {
      id: _id.toString(),
      upvotedBy: [],
      downvotedBy: [],
      ...rest,
    }
  })
}

export const upvoteFeedbackEntry = async (id: string, userId: string) => {
  const res = await feedbackCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    [
      {
        $set: {
          upvotedBy: {
            $cond: [
              { $in: [userId, '$upvotedBy'] },
              { $setDifference: ['$upvotedBy', [userId]] },
              { $concatArrays: ['$upvotedBy', [userId]] },
            ],
          },
          downvotedBy: { $setDifference: ['$downvotedBy', [userId]] },
        },
      },
    ] as any,
    { returnDocument: 'after' }
  )

  if (!res) return null
  const { _id, ...rest } = res as any
  return { id: _id.toString(), ...rest }
}

export const downvoteFeedbackEntry = async (id: string, userId: string) => {
  const res = await feedbackCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    [
      {
        $set: {
          downvotedBy: {
            $cond: [
              { $in: [userId, '$downvotedBy'] },
              { $setDifference: ['$downvotedBy', [userId]] },
              { $concatArrays: ['$downvotedBy', [userId]] },
            ],
          },
          upvotedBy: { $setDifference: ['$upvotedBy', [userId]] },
        },
      },
    ] as any,
    { returnDocument: 'after' }
  )

  if (!res) return null
  const { _id, ...rest } = res as any
  return { id: _id.toString(), ...rest }
}
