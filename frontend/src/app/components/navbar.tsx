import { createMemo } from 'solid-js'
import { A } from '@solidjs/router'
import { Typography } from './ui/typography'
import { primaryRoutes } from '../routes'
import { authClient } from '@/lib/auth-client'

export function Navbar() {
  const session = authClient.useSession()
  const currentUserLabel = createMemo(() => session().data?.user.name ?? 'guest')

  return (
    <header class="mb-8 flex items-center justify-between">
      <div class="flex items-baseline gap-10">
        <A
          href="/"
          class="flex items-center group"
        >
          <Typography variant="title" weight="bold" class="tracking-tight text-(--text)">
            decktype
          </Typography>
        </A>

        <nav class="flex items-center gap-8">
          {primaryRoutes.map((route) => {
            return (
              <A
                href={route.path}
                activeClass="text-(--main)"
                inactiveClass="text-(--sub) hover:text-(--text)"
                class="t-body transition"
              >
                {route.label.toLowerCase()}
              </A>
            )
          })}
        </nav>
      </div>

      <div class="flex items-center text-(--sub)">
        <A
          href="/profile"
          activeClass="text-(--text)"
          inactiveClass="hover:text-(--text)"
          class="flex items-center gap-2 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <Typography variant="caption" weight="bold" class="max-w-32 truncate uppercase tracking-widest">
            {currentUserLabel().toLowerCase()}
          </Typography>
        </A>
      </div>
    </header>
  )
}
