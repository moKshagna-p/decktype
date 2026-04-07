import { Table, type TableColumn } from '@/components/table'
import type { Accessor } from 'solid-js'
import { Match, Switch } from 'solid-js'

import { useLeaderboardQuery } from '@/features/leaderboard/api/hooks'
import { getErrorMessage } from '@/lib/api-client'
import { formatDateTime } from '@/lib/utils'
import { Typography } from '@/components/ui/typography'

import type { LeaderboardDifficulty, LeaderboardEntry } from '../api/contract'

const columns: TableColumn<LeaderboardEntry>[] = [
  {
    id: 'rank',
    label: '#',
    value: (entry) => entry.rank,
  },
  {
    id: 'player',
    label: 'player',
    value: (entry) => entry.displayName,
  },
  {
    id: 'score',
    label: 'score',
    value: (entry) => entry.bestScore,
  },
  {
    id: 'difficulty',
    label: 'difficulty',
    value: (entry) => entry.difficulty,
  },
  {
    id: 'date',
    label: 'date',
    value: (entry) => formatDateTime(entry.bestResultAt),
  },
]

type LeaderboardTableProps = {
  gameId: Accessor<string>
  difficulty: Accessor<LeaderboardDifficulty>
}

export function LeaderboardTable(props: LeaderboardTableProps) {
  const leaderboardQuery = useLeaderboardQuery({
    gameId: props.gameId,
    difficulty: props.difficulty,
    limit: () => 25,
  })

  return (
    <Switch>
      <Match when={leaderboardQuery.isPending}>
        <Typography variant="body" color="sub" class="rounded-lg bg-(--sub-alt) px-4 py-4">
          loading leaderboard...
        </Typography>
      </Match>

      <Match when={leaderboardQuery.error}>
        <Typography variant="body" color="error" class="rounded-lg bg-(--sub-alt) px-4 py-4">
          {getErrorMessage(leaderboardQuery.error, 'Unable to load leaderboard.')}
        </Typography>
      </Match>

      <Match when={leaderboardQuery.data && leaderboardQuery.data.length > 0}>
        <Table
          columns={columns}
          rows={leaderboardQuery.data ?? []}
        />
      </Match>

      <Match when>
        <Typography variant="body" color="sub" class="rounded-lg bg-(--sub-alt) px-4 py-4">
          no scores yet
        </Typography>
      </Match>
    </Switch>
  )
}
