import wordBank from '../data/wordBank'

export type DifficultyKey = 'easy' | 'medium' | 'hard'

export type DifficultyConfig = {
  key: DifficultyKey
  label: string
  spawnIntervalMs: number
  baseSpeed: number
  speedJitter: number
  gravity: number
}

export type FallingWord = {
  id: number
  text: string
  x: number
  y: number
  velocityX: number
  velocityY: number
  rotation: number
  angularVelocity: number
}

export const difficultyOptions: DifficultyConfig[] = [
  {
    key: 'easy',
    label: 'Easy',
    spawnIntervalMs: 1800,
    baseSpeed: 68,
    speedJitter: 20,
    gravity: 6,
  },
  {
    key: 'medium',
    label: 'Medium',
    spawnIntervalMs: 1250,
    baseSpeed: 94,
    speedJitter: 28,
    gravity: 9,
  },
  {
    key: 'hard',
    label: 'Hard',
    spawnIntervalMs: 900,
    baseSpeed: 124,
    speedJitter: 36,
    gravity: 12,
  },
]

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function estimateWordWidth(text: string) {
  return Math.max(96, text.length * 18)
}

export function getDifficulty(key: DifficultyKey) {
  return difficultyOptions.find((option) => option.key === key) ?? difficultyOptions[0]
}

export function createFallingWord(
  id: number,
  width: number,
  difficulty: DifficultyConfig,
) {
  const text = wordBank[Math.floor(Math.random() * wordBank.length)]
  const estimatedWidth = estimateWordWidth(text)
  const safeWidth = Math.max(width - estimatedWidth - 24, 24)
  const x = randomBetween(24, safeWidth)

  const word: FallingWord = {
    id,
    text,
    x,
    y: randomBetween(-120, -40),
    velocityX: randomBetween(-16, 16),
    velocityY: difficulty.baseSpeed + randomBetween(0, difficulty.speedJitter),
    rotation: randomBetween(-10, 10),
    angularVelocity: randomBetween(-12, 12),
  }

  return word
}

export function formatScore(elapsedMs: number) {
  return Math.floor(elapsedMs / 1000)
}
