import { useNavigate, useLocation } from '@solidjs/router'
import { themes } from '@/features/content/themes/registry'
import { wordBanks } from '@/features/content/word-banks/registry'
import type { WordBankId } from '@/features/content/word-banks/types'
import { gameRegistry } from '@/features/games/registry'
import type { ThemeName } from '@/features/content/themes/types'
import type { CommandlineItem, CommandlineProps, CommandlineScope } from '@/features/commandline/types'
import { buildHomePath, getSelectedGameId, getSelectedWordBankId } from '@/app/routes'
import type { GameId } from '@/features/games/types'
import { themeManager } from '@/features/content/themes/manager'

export function createCommandlineRegistry(
  _props: CommandlineProps,
  setScope: (scope: CommandlineScope) => void,
): Record<CommandlineScope, CommandlineItem[]> {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = () => location.pathname
  const selectedGameId = () => getSelectedGameId(location.search) as GameId | null
  const selectedWordBankId = () => (getSelectedWordBankId(location.search) || 'english/core-1k') as WordBankId

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const handleSelectGame = (gameId: GameId | null) => {
    navigate(buildHomePath(gameId, selectedWordBankId()))
  }

  const handleSelectWordBank = (wordBankId: WordBankId) => {
    navigate(buildHomePath(selectedGameId(), wordBankId))
  }

  return {
    root: [
      {
        id: 'group-navigate',
        label: 'Navigate',
        keywords: ['navigate', 'pages', 'routes', 'view'],
        onSelect: () => setScope('navigate'),
      },
      {
        id: 'group-games',
        label: 'Games',
        keywords: ['games', 'modes', 'select game'],
        onSelect: () => setScope('games'),
      },
      {
        id: 'group-word-banks',
        label: 'Word Banks',
        keywords: ['word banks', 'language', 'words', 'dictionary'],
        onSelect: () => setScope('word-banks'),
      },
      {
        id: 'group-themes',
        label: 'Themes',
        keywords: ['themes', 'colors', 'appearance', 'style'],
        onSelect: () => setScope('themes'),
      },
    ],
    navigate: [
      {
        id: 'route-home',
        label: 'View Typing Page',
        keywords: ['home', 'typing page', 'main'],
        active: currentPath() === '/' && !selectedGameId(),
        onSelect: () => handleNavigate('/'),
      },
      {
        id: 'route-leaderboard',
        label: 'View Leaderboards',
        keywords: ['leaderboard', 'scores', 'ranking'],
        active: currentPath() === '/leaderboard',
        onSelect: () => handleNavigate('/leaderboard'),
      },
      {
        id: 'route-about',
        label: 'View About Page',
        keywords: ['about', 'info', 'mission'],
        active: currentPath() === '/about',
        onSelect: () => handleNavigate('/about'),
      },
      {
        id: 'route-profile',
        label: 'View Account Page',
        keywords: ['profile', 'account', 'user'],
        active: currentPath() === '/profile',
        onSelect: () => handleNavigate('/profile'),
      },
    ],
    games: gameRegistry.map((game) => ({
      id: `game-${game.id}`,
      label: game.name,
      keywords: [game.name, game.id, game.description],
      active: selectedGameId() === game.id,
      onSelect: () => handleSelectGame(game.id),
    })),
    themes: (Object.keys(themes) as ThemeName[]).map((themeName) => ({
      id: `theme-${themeName}`,
      label: themeName.replace(/_/g, ' '),
      keywords: [themeName, 'theme', 'color'],
      active: themeManager.current === themeName,
      onSelect: () => themeManager.select(themeName),
    })),
    'word-banks': (Object.entries(wordBanks) as [WordBankId, (typeof wordBanks)[WordBankId]][]).map(
      ([id, wordBank]) => ({
        id: `word-bank-${id}`,
        label: wordBank.label,
        keywords: [wordBank.label, wordBank.language, wordBank.variant, id],
        active: selectedWordBankId() === id,
        onSelect: () => handleSelectWordBank(id),
      }),
    ),
  }
}
