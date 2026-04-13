import { For, Show } from 'solid-js'

import { useContributorsQuery } from '@/features/contributors/api/hooks'
import { getErrorMessage } from '@/lib/api-client'
import { Button } from '@/components/ui/button'

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
    <div class="w-full min-h-[72vh]">
      <div class="flex w-full flex-col gap-10">
        <section class="space-y-5">
          <div class="space-y-3">
            <h2 class="text-2xl leading-tight font-bold capitalize">about decktype</h2>
            <p class="text-base leading-relaxed text-(--sub)">
              decktype is a typing project built around focus, rhythm, and keeping the interface
              out of the way. it takes inspiration from the speed and clarity of monkeytype, then
              pushes that feeling toward something a little more playful, game-like, and personal.
              the goal is simple: make typing feel smooth, fast, and good enough that you want to
              stay for another round.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <Button
              href="https://monkeytype.com"
              target="_blank"
              rel="noreferrer"
              class="h-8 px-3"
            >
              monkeytype website
            </Button>
            <Button
              href="https://github.com/monkeytypegame/monkeytype"
              target="_blank"
              rel="noreferrer"
              class="h-8 px-3"
            >
              monkeytype github
            </Button>
          </div>
        </section>

        <section class="space-y-5">
          <div class="space-y-2">
            <h2 class="text-2xl leading-tight font-bold capitalize">contributors</h2>
            <p class="text-base leading-normal text-(--sub)">
              synced: {formatSyncedAt(contributorsQuery.data?.syncedAt ?? null)}
            </p>
            <div class="pt-1">
              <Button
                href="https://github.com/d1rshan/decktype/graphs/contributors"
                target="_blank"
                rel="noreferrer"
                class="h-8 px-3"
              >
                view on github
              </Button>
            </div>
          </div>

          <Show when={contributorsQuery.isPending}>
            <div class="flex min-h-32 items-center justify-center">
              <div
                class="h-8 w-8 animate-spin rounded-full border-2 border-(--sub)/35 border-t-(--main)"
                aria-label="Loading contributors"
                role="status"
              />
            </div>
          </Show>

          <Show when={contributorsQuery.error}>
            <div class="text-(--error)">
              <p class="text-base leading-normal">{getErrorMessage(contributorsQuery.error, 'Unable to load contributors.')}</p>
            </div>
          </Show>

          <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length > 0}>
            <div class="space-y-3">
              <For each={contributorsQuery.data?.contributors ?? []}>
                {(contributor) => (
                  <a
                    href={contributor.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    class="group flex items-center gap-4 rounded-xl bg-(--sub-alt) px-4 py-4 transition-colors hover:bg-(--sub-alt)/84"
                  >
                    <div class="h-11 w-11 overflow-hidden rounded-full ring-1 ring-(--sub)/30">
                      <img
                        src={contributor.avatarUrl}
                        alt={`${contributor.login} avatar`}
                        class="h-full w-full object-cover transition duration-200 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="truncate">
                        <p class="text-base leading-normal transition-colors group-hover:text-(--main)">
                          {contributor.displayName ?? contributor.login}
                        </p>
                      </div>
                      <div class="truncate">
                        <span class="text-xs leading-tight text-(--sub)">
                          @{contributor.login} • {contributor.contributions} contributions
                        </span>
                      </div>
                    </div>
                  </a>
                )}
              </For>
            </div>
          </Show>

          <Show when={contributorsQuery.data && contributorsQuery.data.contributors.length === 0}>
            <div>
              <p class="text-base leading-normal text-(--sub)">no contributors found yet</p>
            </div>
          </Show>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
