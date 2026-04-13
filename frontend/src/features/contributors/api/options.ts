import { api, request } from '@/lib/api-client'

export const contributorsKeys = {
  all: ['contributors'] as const,
  list: (limit = 100) => ['contributors', limit] as const,
}

export const contributorsQueryOptions = (limit = 100) => ({
  queryKey: contributorsKeys.list(limit),
  queryFn: () =>
    request(
      api.contributors.get({
        $query: {
          limit,
        },
      }),
    ),
})

export const syncContributorsMutationOptions = () => ({
  mutationFn: () => request(api.admin.contributors.sync.post()),
})
