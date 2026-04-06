import { For, Show, createMemo, createSignal } from 'solid-js'

import type { LeaderboardDifficulty } from '@/features/leaderboard/api/contract'
import { useLeaderboardQuery } from '@/features/leaderboard/api/hooks'
import { gameRegistry } from '@/features/games/registry'
import type { GameId } from '@/features/games/types'
import { getErrorMessage } from '@/lib/api-client'
import { Typography } from '@/app/components/ui/typography'
import { Card } from '@/app/components/ui/card'

const difficultyFilters: {
  value: LeaderboardDifficulty
  label: string
}[] = [
  { value: 'easy', label: 'easy' },
  { value: 'medium', label: 'medium' },
  { value: 'hard', label: 'hard' },
]

function formatBestResultAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function toTitleCase(value: string) {
  if (!value) {
    return value
  }

  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function LeaderboardPage() {
  const [gameId, setGameId] = createSignal<GameId>(
    gameRegistry[0]?.id ?? 'falling-words',
  )
  const [difficulty, setDifficulty] = createSignal<LeaderboardDifficulty>('easy')

  const selectedGameName = createMemo(
    () => gameRegistry.find((game) => game.id === gameId())?.name ?? 'Leaderboard',
  )

  const leaderboardQuery = useLeaderboardQuery({
    gameId,
    difficulty,
    limit: () => 25,
  })

  return (
    <div class="w-full min-h-[72vh]">
      <div class="grid items-start gap-7 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside class="space-y-4">
          <Card class="bg-(--sub-alt)/55 p-3 rounded-xl">
            <Typography variant="label" class="px-1 pb-2 font-semibold uppercase tracking-[0.16em] text-(--sub)">
              game
            </Typography>
            <div class="space-y-1.5">
              <For each={gameRegistry}>
                {(game) => (
                  <button
                    type="button"
                    class={`t-body block w-full rounded-md px-3 py-2 text-left transition ${
                      gameId() === game.id
                        ? 'bg-(--main)/20 text-(--main)'
                        : 'text-(--text)/90 hover:bg-(--sub)/20'
                    }`}
                    onClick={() => setGameId(game.id)}
                  >
                    {game.name.toLowerCase()}
                  </button>
                )}
              </For>
            </div>
          </Card>

          <Card class="bg-(--sub-alt)/55 p-3 rounded-xl">
            <Typography variant="label" class="px-1 pb-2 font-semibold uppercase tracking-[0.16em] text-(--sub)">
              difficulty
            </Typography>
            <div class="space-y-1.5">
              <For each={difficultyFilters}>
                {(option) => (
                    <button
                      type="button"
                      class={`t-body block w-full rounded-md px-3 py-2 text-left tracking-[0.05em] transition ${
                        difficulty() === option.value
                          ? 'bg-(--main)/20 text-(--main)'
                          : 'text-(--text)/90 hover:bg-(--sub)/20'
                      }`}
                      onClick={() => setDifficulty(option.value)}
                    >
                    {option.label}
                  </button>
                )}
              </For>
            </div>
          </Card>
        </aside>

        <section class="min-w-0">
          <div class="mb-5 border-b border-(--sub)/25 pb-5">
            <Typography variant="page-title" as="h1" class="leading-tight text-(--text)">
              {toTitleCase(`${selectedGameName()} ${difficulty()} leaderboard`)}
            </Typography>
          </div>

          <Show when={leaderboardQuery.isPending}>
            <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
              loading leaderboard...
            </div>
          </Show>

          <Show when={leaderboardQuery.error}>
            <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
              {getErrorMessage(leaderboardQuery.error, 'Unable to load leaderboard.')}
            </div>
          </Show>

          <Show when={leaderboardQuery.data && leaderboardQuery.data.length > 0}>
            <div class="overflow-hidden rounded-xl bg-(--sub-alt)/35">
              <div class="t-body hidden border-b border-(--sub)/20 px-4 py-3.5 uppercase text-(--sub) sm:grid sm:grid-cols-[0.45fr_1.5fr_0.85fr_0.85fr_1fr] sm:items-center">
                <Typography variant="label" weight="bold">#</Typography>
                <Typography variant="label" weight="bold">player</Typography>
                <Typography variant="label" weight="bold">score</Typography>
                <Typography variant="label" weight="bold">difficulty</Typography>
                <Typography variant="label" weight="bold">date</Typography>
              </div>

              <For each={leaderboardQuery.data}>
                {(entry) => (
                  <div class="t-body grid gap-2 border-b border-(--sub)/10 px-4 py-3.5 last:border-b-0 sm:grid-cols-[0.45fr_1.5fr_0.85fr_0.85fr_1fr] sm:items-center">
                    <Typography variant="body" weight="semibold" class="text-(--main)">{entry.rank}</Typography>
                    <div>
                      <Typography variant="body" class="truncate text-(--text)">{entry.displayName}</Typography>
                    </div>
                    <Typography variant="body" weight="semibold" class="text-(--text)">{entry.bestScore}</Typography>
                    <Typography variant="body" class="text-(--sub)">{entry.difficulty}</Typography>
                    <Typography variant="body" class="text-(--sub)">{formatBestResultAt(entry.bestResultAt)}</Typography>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <Show when={leaderboardQuery.data && leaderboardQuery.data.length === 0 && !leaderboardQuery.isPending}>
            <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
              no scores yet
            </div>
          </Show>
        </section>
      </div>
    </div>
  )
}

export default LeaderboardPage
