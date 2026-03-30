import { createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import type { GameDefinition } from '../../entities/game/types'
import { getWordBank } from '../../entities/word-bank/get-word-bank'
import {
  createFallingWord,
  getDifficulty,
} from './games/falling-words/falling-words-game'
import type {
  DifficultyKey,
  FallingWord,
  GamePhase,
} from './games/falling-words/types'

function formatScore(elapsedMs: number) {
  return Math.floor(elapsedMs / 1000)
}

function findExactMatch(words: FallingWord[], value: string) {
  return words
    .filter((word) => word.text === value)
    .sort((left, right) => right.y - left.y)[0]
}

export function useTypingSession(game: GameDefinition) {
  const wordBank = getWordBank(game.defaultLanguage)

  let inputRef: HTMLInputElement | undefined
  let animationFrame = 0
  let nextWordId = 1
  let lastFrameTime = 0
  let lastSpawnTime = 0
  let runStartTime = 0

  const [phase, setPhase] = createSignal<GamePhase>('idle')
  const [difficulty, setDifficulty] = createSignal<DifficultyKey>('easy')
  const [fieldWidth, setFieldWidth] = createSignal(window.innerWidth)
  const [fieldHeight, setFieldHeight] = createSignal(window.innerHeight)
  const [activeWords, setActiveWords] = createSignal<FallingWord[]>([])
  const [currentInput, setCurrentInput] = createSignal('')
  const [elapsedMs, setElapsedMs] = createSignal(0)

  const selectedDifficulty = createMemo(() => getDifficulty(difficulty()))
  const score = createMemo(() => formatScore(elapsedMs()))
  const phaseLabel = createMemo(() => {
    if (phase() === 'running') {
      return selectedDifficulty().label
    }
    if (phase() === 'game-over') {
      return 'TERMINATED'
    }
    return 'STANDBY'
  })

  const stopLoop = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }
  }

  const updateFieldSize = () => {
    setFieldWidth(window.innerWidth)
    setFieldHeight(window.innerHeight)
  }

  const focusInput = () => {
    inputRef?.focus()
  }

  const spawnWord = () => {
    if (!wordBank || wordBank.words.length === 0) {
      return
    }

    const nextWord = createFallingWord(
      nextWordId,
      fieldWidth(),
      wordBank.words,
      selectedDifficulty(),
    )
    nextWordId += 1
    setActiveWords((current) => [...current, nextWord])
  }

  const resetGame = (nextDifficulty = difficulty()) => {
    stopLoop()
    setDifficulty(nextDifficulty)
    setPhase('idle')
    setActiveWords([])
    setCurrentInput('')
    if (inputRef) {
      inputRef.value = ''
    }
    focusInput()
    setElapsedMs(0)
    lastFrameTime = 0
    lastSpawnTime = 0
    runStartTime = 0
  }

  const startGame = () => {
    resetGame(difficulty())
    setPhase('running')
    runStartTime = performance.now()
    lastFrameTime = runStartTime
    lastSpawnTime = runStartTime
    spawnWord()
  }

  const endGame = () => {
    setPhase('game-over')
    stopLoop()
  }

  const submitExactMatch = (value: string) => {
    const targetWord = findExactMatch(activeWords(), value)
    if (!targetWord) {
      return false
    }

    setActiveWords((current) => current.filter((word) => word.id !== targetWord.id))
    setCurrentInput('')
    if (inputRef) {
      inputRef.value = ''
    }
    return true
  }

  const handleDifficultyChange = (nextDifficulty: DifficultyKey) => {
    if (phase() === 'running') {
      resetGame(nextDifficulty)
      return
    }

    setDifficulty(nextDifficulty)
  }

  const handleInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    const sanitized = event.currentTarget.value.replace(/\s+/g, '')
    if (phase() !== 'running') {
      event.currentTarget.value = ''
      return
    }

    setCurrentInput(sanitized)
    submitExactMatch(sanitized)
  }

  const handleKeyDown = (
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      resetGame()
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (phase() !== 'running') {
        startGame()
      } else {
        submitExactMatch(currentInput())
      }
    }

    if (event.key === ' ') {
      event.preventDefault()
      submitExactMatch(currentInput())
    }
  }

  createEffect(() => {
    if (phase() !== 'running') {
      stopLoop()
      return
    }

    const tick = (timestamp: number) => {
      const deltaSeconds = Math.min((timestamp - lastFrameTime) / 1000, 0.032)
      lastFrameTime = timestamp
      setElapsedMs(timestamp - runStartTime)

      const difficultyConfig = selectedDifficulty()

      if (timestamp - lastSpawnTime >= difficultyConfig.spawnIntervalMs) {
        spawnWord()
        lastSpawnTime = timestamp
      }

      let hitBottom = false

      setActiveWords((current) =>
        current.map((word) => {
          const nextVelocityY = word.velocityY + difficultyConfig.gravity * deltaSeconds
          const nextX = word.x + word.velocityX * deltaSeconds
          const maxX = Math.max(fieldWidth() - word.text.length * 18 - 36, 24)
          const bouncedX =
            nextX <= 20 || nextX >= maxX ? word.velocityX * -1 : word.velocityX
          const clampedX = Math.min(Math.max(nextX, 20), maxX)
          const nextY = word.y + nextVelocityY * deltaSeconds
          const nextRotation = word.rotation + word.angularVelocity * deltaSeconds

          if (nextY >= fieldHeight() - 40) {
            hitBottom = true
          }

          return {
            ...word,
            x: clampedX,
            y: nextY,
            velocityX: bouncedX,
            velocityY: nextVelocityY,
            rotation: nextRotation,
          }
        }),
      )

      if (hitBottom) {
        endGame()
        return
      }

      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame((timestamp) => {
      lastFrameTime = timestamp
      tick(timestamp)
    })

    onCleanup(stopLoop)
  })

  onMount(() => {
    updateFieldSize()
    focusInput()
    window.addEventListener('resize', updateFieldSize)
  })

  onCleanup(() => {
    stopLoop()
    window.removeEventListener('resize', updateFieldSize)
  })

  return {
    activeWords,
    currentInput,
    difficulty,
    handleDifficultyChange,
    handleInput,
    handleKeyDown,
    phase,
    phaseLabel,
    resetGame,
    score,
    setInputRef: (element: HTMLInputElement) => {
      inputRef = element
    },
    startGame,
    focusInput,
  }
}
