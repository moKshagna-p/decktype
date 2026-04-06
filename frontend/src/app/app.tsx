import { createEffect, createMemo, onMount, type ParentProps } from 'solid-js'
import { Router, Route, useNavigate, useLocation } from '@solidjs/router'
import ToastRegion from '@/app/components/toast-region'
import Commandline from '@/features/commandline/components/commandline'
import { games } from '@/features/games/registry'
import AboutPage from '@/pages/about-page'
import HomePage from '@/pages/home-page'
import LeaderboardPage from '@/pages/leaderboard-page'
import ProfilePage from '@/pages/profile-page'
import type { GameId } from '@/features/games/types'
import type { WordBankId } from '@/features/content/word-banks/types'
import {
  buildHomePath,
  getSelectedGameId,
  getSelectedWordBankId,
} from './routes'
import { themeManager } from '@/features/content/themes/manager'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'

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
          const location = useLocation()
          const selectedGameId = createMemo(() => getSelectedGameId(location.search) as GameId | null)
          const selectedWordBankId = createMemo(() => getSelectedWordBankId(location.search) as WordBankId | null)

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
              onSelectGame={(gameId) => navigate(buildHomePath(gameId, selectedWordBankId()))}
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
