import { ApiError } from '../../lib/errors/api-error'
import { env } from '../../config/env'
import { errorCodes } from '../../lib/errors/error-codes'
import { auth } from './auth'

export const requireSession = async (headers: Headers) => {
  const currentSession = await auth.api.getSession({
    headers,
  })

  if (!currentSession) {
    throw new ApiError({
      status: 401,
      code: errorCodes.unauthorized,
      message: 'You must be signed in.',
    })
  }

  return currentSession
}

export const requireAdminSession = async (headers: Headers) => {
  const currentSession = await requireSession(headers)
  const userEmail = currentSession.user.email?.trim().toLowerCase()

  if (!userEmail || !env.adminEmails.includes(userEmail)) {
    throw new ApiError({
      status: 403,
      code: errorCodes.forbidden,
      message: 'You are not authorized to access admin resources.',
    })
  }

  return currentSession
}
