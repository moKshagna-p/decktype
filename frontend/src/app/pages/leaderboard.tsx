import { For, createMemo, createSignal } from 'solid-js'

import type { LeaderboardDifficulty } from '@/features/leaderboard/api/contract'
import { LeaderboardTable } from '@/features/leaderboard/components/leaderboard-table'
import { gameRegistry } from '@/features/games/registry'
import type { GameId } from '@/features/games/types'
import { Typography } from '@/components/ui/typography'
import { Card } from '@/components/ui/card'
import { getGameName } from '@/lib/utils'

const difficulties: LeaderboardDifficulty[] = ['easy', 'medium', 'hard']

function LeaderboardPage() {
  const [gameId, setGameId] = createSignal<GameId>(
    gameRegistry[0].id,
  )

  const [difficulty, setDifficulty] = createSignal<LeaderboardDifficulty>('easy')

  const selectedGameName = createMemo(
    () => getGameName(gameId()),
  )

  return (
    <div class="w-full min-h-[72vh]">
      <div class="grid items-start gap-7 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside class="space-y-4">
          <Card class="p-3">
            <Typography variant="label" class="px-1 pb-2">
              game
            </Typography>
            <div class="space-y-1.5">
              <For each={gameRegistry}>
                {(game) => (
                  <button
                    type="button"
                    class={`t-body block w-full rounded-md px-3 py-2 text-left transition ${gameId() === game.id
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

          <Card class="p-3">
            <Typography variant="label" class="px-1 pb-2">
              difficulty
            </Typography>
            <div class="space-y-1.5">
              <For each={difficulties}>
                {(level) => (
                  <button
                    type="button"
                    class={`t-body block w-full rounded-md px-3 py-2 text-left tracking-[0.05em] transition ${difficulty() === level
                      ? 'bg-(--main)/20 text-(--main)'
                      : 'text-(--text)/90 hover:bg-(--sub)/20'
                      }`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                )}
              </For>
            </div>
          </Card>
        </aside>

        <section class="min-w-0">
          <div class="mb-5 border-b border-(--sub)/25 pb-5">
            <Typography variant="page-title" as="h1" class="leading-tight capitalize">
              {selectedGameName()} {difficulty()} leaderboard
            </Typography>
          </div>

          <LeaderboardTable gameId={gameId} difficulty={difficulty} />
        </section>
      </div>
    </div>
  )
}

export default LeaderboardPage
