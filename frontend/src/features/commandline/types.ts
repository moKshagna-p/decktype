export type CommandlineScope = 'root' | 'navigate' | 'games' | 'word-banks' | 'themes'

export type CommandlineItem = {
  id: string
  label: string
  keywords: string[]
  active?: boolean
  onSelect: () => void
}

export type CommandlineProps = {
  // Now independent of theme props as it uses themeManager
}
