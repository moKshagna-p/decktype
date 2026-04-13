import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'

import { feedbackKeys } from '@/features/feedback/api/options'
import { toastApiError } from '@/lib/api-client'
import {
  adminDeleteFeedbackMutationOptions,
  adminKeys,
  adminUsersCountQueryOptions,
  adminUsersListQueryOptions,
} from './options'

export const useAdminUsersCountQuery = () =>
  useQuery(() => ({
    ...adminUsersCountQueryOptions(),
    retry: false,
  }))

export const useAdminUsersListQuery = () =>
  useQuery(() => ({
    ...adminUsersListQueryOptions(),
    retry: false,
  }))

export const useAdminDeleteFeedbackMutation = () => {
  const client = useQueryClient()

  return useMutation(() => ({
    ...adminDeleteFeedbackMutationOptions(),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: feedbackKeys.all })
      void client.invalidateQueries({ queryKey: adminKeys.all })
    },
    onError: (error) => {
      toastApiError(error, 'unable to delete message.')
    },
  }))
}
