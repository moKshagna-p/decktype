import { games } from '@/features/games/registry'

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function getGameName(gameId: string) {
  const game = games[gameId as keyof typeof games]

  return game?.name ?? gameId
}
