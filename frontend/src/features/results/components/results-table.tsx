import { Table, type TableColumn } from '@/components/table'
import { Match, Switch } from 'solid-js'

import { useMyResultsQuery } from '@/features/results/api/hooks'
import { Typography } from '@/components/ui/typography'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'
import { formatDateTime, getGameName } from '@/lib/utils'

type ResultsTableRow = NonNullable<ReturnType<typeof useMyResultsQuery>['data']>[number]

const columns: TableColumn<ResultsTableRow>[] = [
  {
    id: 'game',
    label: 'game',
    value: (result) => getGameName(result.gameId),
  },
  {
    id: 'score',
    label: 'score',
    value: (result) => result.score,
  },
  {
    id: 'difficulty',
    label: 'difficulty',
    value: (result) => result.difficulty,
  },
  {
    id: 'date',
    label: 'date',
    value: (result) => formatDateTime(result.createdAt),
  },
]

function ResultsTable() {
  const session = authClient.useSession()
  const resultsQuery = useMyResultsQuery({
    enabled: () => Boolean(session().data?.user),
    limit: () => 12,
  })

  return (
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

      <Match when={resultsQuery.data && resultsQuery.data.length > 0}>
        <Table
          columns={columns}
          rows={resultsQuery.data ?? []}
        />
      </Match>

      <Match when>
        <Typography variant="body" color="sub" class="rounded-lg bg-(--sub-alt) px-4 py-4">
          no results yet
        </Typography>
      </Match>
    </Switch>
  )
}

export default ResultsTable
