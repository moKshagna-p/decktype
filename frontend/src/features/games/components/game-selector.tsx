import { For } from 'solid-js'
import { gameRegistry } from '@/features/games/registry'
import type { GameId } from '@/features/games/types'
import { Card } from '@/app/components/ui/card'
import { Typography } from '@/app/components/ui/typography'

type GameSelectorProps = {
  activeGameId?: GameId | null
  onSelectGame: (gameId: GameId) => void
}

function GameSelector(props: GameSelectorProps) {
  return (
    <div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <For each={gameRegistry}>
        {(game) => (
          <Card
            as="button"
            type="button"
            hoverable
            class="group relative flex flex-col items-start gap-6 bg-(--sub-alt)/55 p-10 text-left transition-all hover:-translate-y-1 hover:bg-(--sub-alt)/70"
            onClick={() => props.onSelectGame(game.id)}
          >
            <div class="flex flex-col gap-3">
              <Typography
                variant="title"
                weight="bold"
                class="tracking-tight text-(--text) group-hover:text-(--main) transition-colors"
              >
                {game.name.toLowerCase()}
              </Typography>
              <Typography
                variant="body"
                class="leading-relaxed text-(--sub) opacity-80"
              >
                {game.description.toLowerCase()}
              </Typography>
            </div>

            <div class="absolute bottom-10 right-10 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-(--main)">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </Card>
        )}
      </For>
    </div>
  )
}

export default GameSelector
