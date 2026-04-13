import { ApiError } from '../../lib/errors/api-error'
import { errorCodes } from '../../lib/errors/error-codes'
import { ObjectId } from 'mongodb'

import * as repository from './repository'

export const getUsersCount = async () => {
  const count = await repository.countUsers()

  return { count }
}

export const getUsersList = async () => {
  return repository.listUsers(500)
}

export const removeFeedback = async (id: string) => {
  if (!ObjectId.isValid(id)) {
    throw new ApiError({
      status: 400,
      code: errorCodes.badRequest,
      message: 'Invalid feedback id.',
    })
  }

  const deleted = await repository.deleteFeedbackById(id)

  if (!deleted) {
    throw new ApiError({
      status: 404,
      code: errorCodes.notFound,
      message: 'Feedback not found.',
    })
  }

  return { ok: true }
}
