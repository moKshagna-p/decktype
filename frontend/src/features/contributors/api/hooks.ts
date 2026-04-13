import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import { toastApiError } from '@/lib/api-client'
import { contributorsKeys, contributorsQueryOptions, syncContributorsMutationOptions } from './options'

export const useContributorsQuery = (options?: {
  limit?: Accessor<number | undefined>
}) =>
  useQuery(() => {
    const limit = options?.limit?.() ?? 100

    return contributorsQueryOptions(limit)
  })

export const useSyncContributorsMutation = () => {
  const client = useQueryClient()

  return useMutation(() => ({
    ...syncContributorsMutationOptions(),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: contributorsKeys.all })
    },
    onError: (error) => {
      toastApiError(error, 'unable to sync contributors.')
    },
  }))
}
