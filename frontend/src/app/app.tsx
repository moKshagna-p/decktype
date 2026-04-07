import { createEffect, createMemo, onMount, type ParentProps } from 'solid-js'
import { Router, Route, useNavigate, useSearchParams } from '@solidjs/router'
import ToastRegion from '@/components/toast-region'
import Commandline from '@/features/commandline/components/commandline'
import { games } from '@/features/games/registry'
import AboutPage from '@/app/pages/about'
import HomePage from '@/app/pages/home'
import LeaderboardPage from '@/app/pages/leaderboard'
import ProfilePage from '@/app/pages/profile'
import type { GameId } from '@/features/games/types'
import type { WordBankId } from '@/features/content/word-banks/types'
import { themeManager } from '@/features/content/themes/manager'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'

function Layout(props: ParentProps) {
  onMount(() => {
    themeManager.init()
  })

  return (
    <div class="relative min-h-screen bg-(--bg) font-mono text-(--text)">
      <Commandline />
      <ToastRegion />
      <div class="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
        <Navbar />

        <main class="flex-1 flex flex-col justify-center py-8">
          {props.children}
        </main>

        <Footer />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router root={Layout}>
      <Route
        path="/"
        component={() => {
          const navigate = useNavigate()
          const [searchParams] = useSearchParams()
          const selectedGameId = createMemo(() => searchParams.game as GameId | null)
          const selectedWordBankId = createMemo(() => (searchParams.wordBank || 'english/core-1k') as WordBankId)

          createEffect(() => {
            const gameId = selectedGameId()
            if (gameId && !games[gameId]) {
              navigate('/', { replace: true })
            }
          })

          return (
            <HomePage
              selectedGameId={selectedGameId()}
              selectedWordBankId={selectedWordBankId()}
              onSelectGame={(gameId) => navigate(gameId ? `/?game=${gameId}&wordBank=${selectedWordBankId()}` : '/')}
            />
          )
        }}
      />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/profile" component={() => {
        const navigate = useNavigate()
        return <ProfilePage onNavigate={navigate} />
      }} />
      <Route path="/about" component={AboutPage} />
      <Route path="*paramName" component={() => {
        const navigate = useNavigate()
        navigate('/', { replace: true })
        return null
      }} />
    </Router>
  )
}

export default App
