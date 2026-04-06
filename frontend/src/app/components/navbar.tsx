import { createMemo } from 'solid-js'
import { A } from '@solidjs/router'
import { User } from 'lucide-solid'
import { Typography } from './ui/typography'
import { authClient } from '@/lib/auth-client'

const routes = [
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'About', path: '/about' },
]

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
          <Typography variant="title" tracking="tight">
            decktype
          </Typography>
        </A>

        <nav class="flex items-center gap-8">
          {routes.map((route) => {
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
          <User size={18} strokeWidth={2} />
          <Typography variant="caption" weight="bold" uppercase tracking="widest" truncate class="max-w-32">
            {currentUserLabel().toLowerCase()}
          </Typography>
        </A>
      </div>
    </header>
  )
}
