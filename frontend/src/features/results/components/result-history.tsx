import { For, Match, Switch } from 'solid-js'

import { games } from '@/features/games/registry'
import { useMyResultsQuery } from '@/features/results/api/hooks'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'
import { Typography } from '@/app/components/ui/typography'

function formatPlayedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getGameName(gameId: string) {
  const game = games[gameId as keyof typeof games]

  return game?.name ?? gameId
}

function ResultHistory() {
  const session = authClient.useSession()
  const resultsQuery = useMyResultsQuery({
    enabled: () => Boolean(session().data?.user),
    limit: () => 12,
  })

  return (
    <div class="space-y-4">
      <Typography variant="label">
        recent results
      </Typography>

      <Switch>
        <Match when={resultsQuery.isPending}>
          <Typography variant="body" color="sub" class="rounded-lg bg-(--sub-alt) px-4 py-4">
            loading results...
          </Typography>
        </Match>

        <Match when={resultsQuery.error}>
          <Typography variant="body" color="error" class="rounded-lg bg-(--sub-alt) px-4 py-4">
            {getErrorMessage(resultsQuery.error, 'Unable to load results.')}
          </Typography>
        </Match>

        <Match when={resultsQuery.data?.length}>
          <div class="overflow-hidden rounded-xl bg-(--sub-alt)/35">
            <div class="hidden border-b border-(--sub)/20 px-4 py-3.5 sm:grid sm:grid-cols-[1.2fr_0.7fr_0.8fr_1fr] sm:items-center">
              <Typography variant="label">game</Typography>
              <Typography variant="label">score</Typography>
              <Typography variant="label">difficulty</Typography>
              <Typography variant="label">date</Typography>
            </div>

            <For each={resultsQuery.data}>
              {(result) => (
                <div class="grid gap-2 border-b border-(--sub)/10 px-4 py-3.5 last:border-b-0 sm:grid-cols-[1.2fr_0.7fr_0.8fr_1fr] sm:items-center">
                  <Typography variant="body">{getGameName(result.gameId)}</Typography>
                  <Typography variant="body" weight="semibold">{result.score}</Typography>
                  <Typography variant="body" color="sub">{result.difficulty}</Typography>
                  <Typography variant="body" color="sub">{formatPlayedAt(result.createdAt)}</Typography>
                </div>
              )}
            </For>
          </div>
        </Match>

        <Match when>
          <Typography variant="body" color="sub" class="rounded-lg bg-(--sub-alt) px-4 py-4">
            no results yet
          </Typography>
        </Match>
      </Switch>
    </div>
  )
}

export default ResultHistory
