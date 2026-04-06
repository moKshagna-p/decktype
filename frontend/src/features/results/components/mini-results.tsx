import { For, Match, Switch, createMemo } from 'solid-js'
import { games } from '@/features/games/registry'
import { useMyResultsQuery } from '@/features/results/api/hooks'
import { authClient } from '@/lib/auth-client'
import { Typography } from '@/app/components/ui/typography'

function getGameName(gameId: string) {
  const game = games[gameId as keyof typeof games]
  return game?.name ?? gameId
}

export function MiniResults() {
  const session = authClient.useSession()
  const resultsQuery = useMyResultsQuery({
    enabled: () => Boolean(session().data?.user),
    limit: () => 3,
  })

  const results = createMemo(() => resultsQuery.data ?? [])

  return (
    <div class="flex flex-col gap-3">
      <Typography variant="label" weight="bold" class="uppercase tracking-widest text-(--sub)/50">
        last runs
      </Typography>

      <Switch>
        <Match when={resultsQuery.isPending}>
          <Typography variant="caption" class="animate-pulse text-(--sub)/30 italic">loading...</Typography>
        </Match>

        <Match when={results().length > 0}>
          <div class="flex flex-col gap-2">
            <For each={results()}>
              {(result) => (
                <div class="flex items-center justify-between gap-2 rounded-lg border border-(--sub)/5 bg-(--sub-alt)/20 px-3 py-2 transition hover:bg-(--sub-alt)/40">
                  <div class="min-w-0 flex-1">
                    <Typography variant="caption" weight="bold" class="truncate text-(--text)">
                      {getGameName(result.gameId).toLowerCase()}
                    </Typography>
                    <Typography variant="label" class="text-(--sub)/60">
                      {result.difficulty}
                    </Typography>
                  </div>
                  <div class="text-right">
                    <Typography variant="body" weight="bold" class="text-(--main)">
                      {result.score}
                    </Typography>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Match>

        <Match when>
          <Typography variant="caption" class="text-(--sub)/30 italic">no data</Typography>
        </Match>
      </Switch>
    </div>
  )
}

export default MiniResults
