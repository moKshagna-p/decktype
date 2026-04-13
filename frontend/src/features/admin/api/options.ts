import { api, request } from '@/lib/api-client'

export const adminKeys = {
  all: ['admin'] as const,
  usersCount: ['admin', 'users-count'] as const,
  usersList: ['admin', 'users-list'] as const,
}

export const adminUsersCountQueryOptions = () => ({
  queryKey: adminKeys.usersCount,
  queryFn: () => request(api.admin.users.count.get()),
})

export const adminUsersListQueryOptions = () => ({
  queryKey: adminKeys.usersList,
  queryFn: () => request(api.admin.users.get()),
})

export const adminDeleteFeedbackMutationOptions = () => ({
  mutationFn: (id: string) => request(api.admin.feedback[id].delete()),
})
