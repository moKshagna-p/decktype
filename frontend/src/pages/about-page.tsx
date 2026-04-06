import { For, Show } from 'solid-js'

import { useContributorsQuery } from '@/features/contributors/api/hooks'
import { getErrorMessage } from '@/lib/api-client'
import { Typography } from '@/app/components/ui/typography'
import { Button } from '@/app/components/ui/button'

function formatSyncedAt(value: string | null) {
  if (!value) {
    return 'not synced yet'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function AboutPage() {
  const contributorsQuery = useContributorsQuery({
    limit: () => 200,
  })

  return (
    <div class="w-full min-h-[72vh] space-y-6">
      <section class="rounded-xl bg-(--sub-alt)/32 p-5">
        <Typography variant="page-title" as="h1" class="leading-tight text-(--text)">about decktype</Typography>
        <Typography variant="body" class="mt-3 max-w-3xl text-(--sub)">
          decktype is inspired by monkeytype&apos;s speed-typing experience. the project takes
          inspiration from the flow and focus of monkeytype while building its own direction.
        </Typography>
        <div class="mt-4 flex flex-wrap gap-3">
          <Button
            as="a"
            href="https://monkeytype.com"
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="sm"
            class="px-3 py-1.5"
          >
            monkeytype website
          </Button>
          <Button
            as="a"
            href="https://github.com/monkeytypegame/monkeytype"
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="sm"
            class="px-3 py-1.5"
          >
            monkeytype github
          </Button>
        </div>
      </section>

      <section class="rounded-xl bg-(--sub-alt)/32 p-5">
        <Typography variant="label" weight="semibold" class="uppercase tracking-[0.16em] text-(--sub)">
          creator
        </Typography>
        <Typography variant="title" class="mt-2 text-(--text)">d1rshan</Typography>
        <div class="mt-3 flex flex-wrap gap-3">
          <Button
            as="a"
            href="https://github.com/d1rshan"
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="sm"
            class="px-3 py-1.5"
          >
            github profile
          </Button>
          <Button
            as="a"
            href="https://github.com/d1rshan/decktype"
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="sm"
            class="px-3 py-1.5"
          >
            decktype repository
          </Button>
        </div>
      </section>

      <section class="rounded-xl bg-(--sub-alt)/32 p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Typography variant="label" weight="semibold" class="uppercase tracking-[0.16em] text-(--sub)">
              contributors
            </Typography>
            <Typography variant="body" class="mt-1 text-(--sub)">
              synced: {formatSyncedAt(contributorsQuery.data?.syncedAt ?? null)}
            </Typography>
          </div>
          <Button
            as="a"
            href="https://github.com/d1rshan/decktype/graphs/contributors"
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="sm"
            class="px-3 py-1.5"
          >
            view on github
          </Button>
        </div>

        <Show when={contributorsQuery.isPending}>
          <div class="t-body mt-4 rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
            loading contributors...
          </div>
        </Show>

        <Show when={contributorsQuery.error}>
          <div class="t-body mt-4 rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
            {getErrorMessage(contributorsQuery.error, 'Unable to load contributors.')}
          </div>
        </Show>

        <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length > 0}>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <For each={contributorsQuery.data?.contributors ?? []}>
              {(contributor) => (
                <a
                  href={contributor.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  class="flex items-center gap-3 rounded-lg bg-(--sub-alt)/52 px-3 py-3 transition hover:bg-(--sub-alt)/74"
                >
                  <div class="h-9 w-9 overflow-hidden rounded-full ring-1 ring-(--sub)/35">
                    <img
                      src={contributor.avatarUrl}
                      alt={`${contributor.login} avatar`}
                      class="h-full w-full object-cover opacity-90"
                      loading="lazy"
                    />
                  </div>
                  <div class="min-w-0">
                    <Typography variant="body" class="truncate text-(--text)">
                      {contributor.displayName ?? contributor.login}
                    </Typography>
                    <Typography variant="caption" class="truncate text-(--sub)">
                      @{contributor.login} • {contributor.contributions} contributions
                    </Typography>
                  </div>
                </a>
              )}
            </For>
          </div>
        </Show>

        <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length === 0}>
          <div class="t-body mt-4 rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
            no contributors found yet
          </div>
        </Show>
      </section>

      <Typography variant="caption" class="text-(--sub)">
        thank you to everyone who contributed code, feedback, and ideas.
      </Typography>
    </div>
  )
}

export default AboutPage
