import { useQuery } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import { contributorsQueryOptions } from './options'

export const useContributorsQuery = (options?: {
  limit?: Accessor<number | undefined>
}) =>
  useQuery(() => {
    const limit = options?.limit?.() ?? 100

    return contributorsQueryOptions(limit)
  })
