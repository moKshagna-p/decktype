import { For, Show } from 'solid-js'

import { useContributorsQuery } from '@/features/contributors/api/hooks'
import { getErrorMessage } from '@/lib/api-client'

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
      <section class="rounded-xl bg-[var(--sub-alt)]/32 p-5 ring-1 ring-[var(--sub)]/14">
        <h1 class="text-3xl leading-tight text-[var(--text)]">about decktype</h1>
        <p class="mt-3 max-w-3xl text-sm text-[var(--sub)]">
          decktype is inspired by monkeytype&apos;s speed-typing experience. the project takes
          inspiration from the flow and focus of monkeytype while building its own direction.
        </p>
        <div class="mt-4 flex flex-wrap gap-3 text-sm">
          <a
            href="https://monkeytype.com"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-[var(--sub)]/35 px-3 py-1.5 text-[var(--sub)] transition hover:text-[var(--text)]"
          >
            monkeytype website
          </a>
          <a
            href="https://github.com/monkeytypegame/monkeytype"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-[var(--sub)]/35 px-3 py-1.5 text-[var(--sub)] transition hover:text-[var(--text)]"
          >
            monkeytype github
          </a>
        </div>
      </section>

      <section class="rounded-xl bg-[var(--sub-alt)]/32 p-5 ring-1 ring-[var(--sub)]/14">
        <div class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
          creator
        </div>
        <div class="mt-2 text-2xl text-[var(--text)]">d1rshan</div>
        <div class="mt-3 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/d1rshan"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-[var(--sub)]/35 px-3 py-1.5 text-[var(--sub)] transition hover:text-[var(--text)]"
          >
            github profile
          </a>
          <a
            href="https://github.com/d1rshan/decktype"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-[var(--sub)]/35 px-3 py-1.5 text-[var(--sub)] transition hover:text-[var(--text)]"
          >
            decktype repository
          </a>
        </div>
      </section>

      <section class="rounded-xl bg-[var(--sub-alt)]/32 p-5 ring-1 ring-[var(--sub)]/14">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
              contributors
            </div>
            <div class="mt-1 text-sm text-[var(--sub)]">
              synced: {formatSyncedAt(contributorsQuery.data?.syncedAt ?? null)}
            </div>
          </div>
          <a
            href="https://github.com/d1rshan/decktype/graphs/contributors"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-[var(--sub)]/35 px-3 py-1.5 text-sm text-[var(--sub)] transition hover:text-[var(--text)]"
          >
            view on github
          </a>
        </div>

        <Show when={contributorsQuery.isPending}>
          <div class="mt-4 rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--sub)]">
            loading contributors...
          </div>
        </Show>

        <Show when={contributorsQuery.error}>
          <div class="mt-4 rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--error)]">
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
                  class="flex items-center gap-3 rounded-lg bg-[var(--sub-alt)]/52 px-3 py-3 transition hover:bg-[var(--sub-alt)]/74"
                >
                  <div class="h-9 w-9 overflow-hidden rounded-full ring-1 ring-[var(--sub)]/35">
                    <img
                      src={contributor.avatarUrl}
                      alt={`${contributor.login} avatar`}
                      class="h-full w-full object-cover opacity-90"
                      loading="lazy"
                    />
                  </div>
                  <div class="min-w-0">
                    <div class="truncate text-sm text-[var(--text)]">
                      {contributor.displayName ?? contributor.login}
                    </div>
                    <div class="truncate text-xs text-[var(--sub)]">
                      @{contributor.login} • {contributor.contributions} contributions
                    </div>
                  </div>
                </a>
              )}
            </For>
          </div>
        </Show>

        <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length === 0}>
          <div class="mt-4 rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--sub)]">
            no contributors found yet
          </div>
        </Show>
      </section>

      <div class="text-xs text-[var(--sub)]">
        thank you to everyone who contributed code, feedback, and ideas.
      </div>
    </div>
  )
}

export default AboutPage
