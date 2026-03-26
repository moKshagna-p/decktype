import { createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import DifficultySelector from './components/DifficultySelector'
import FallingWordsField from './components/FallingWordsField'
import GameHud from './components/GameHud'
import {
  createFallingWord,
  formatScore,
  getDifficulty,
  type DifficultyKey,
  type FallingWord,
} from './utils/fallingWords'

type GamePhase = 'idle' | 'running' | 'game-over'

function App() {
  let inputRef: HTMLInputElement | undefined
  let fieldRef: HTMLDivElement | undefined
  let animationFrame = 0
  let resizeObserver: ResizeObserver | undefined
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

  const phaseLabel = createMemo(() => {
    if (phase() === 'running') {
      return selectedDifficulty().label
    }
    if (phase() === 'game-over') {
      return 'TERMINATED'
    }
    return 'STANDBY'
  })

  const score = createMemo(() => formatScore(elapsedMs()))

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

  const spawnWord = () => {
    const nextWord = createFallingWord(
      nextWordId,
      fieldWidth(),
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
      inputRef.focus()
    }
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
    const exactMatches = activeWords()
      .filter((word) => word.text === value)
      .sort((left, right) => right.y - left.y)

    const targetWord = exactMatches[0]
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

    onCleanup(() => stopLoop())
  })

  onMount(() => {
    updateFieldSize()
    inputRef?.focus()
    window.addEventListener('resize', updateFieldSize)
  })

  onCleanup(() => {
    stopLoop()
    window.removeEventListener('resize', updateFieldSize)
  })

  return (
    <div class="relative h-screen w-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      {/* Background Layer */}
      <div ref={fieldRef} class="absolute inset-0 z-0">
        <FallingWordsField
          words={activeWords()}
          currentInput={currentInput()}
          phase={phase()}
          score={score()}
          onFieldClick={() => inputRef?.focus()}
        />
      </div>

      {/* Overlay UI Layer */}
      <div class="pointer-events-none relative z-10 flex h-full flex-col p-8 sm:p-12">
        <header class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="text-xs font-bold tracking-[0.5em] text-white opacity-40 uppercase">
              Void Protocol v1.0
            </h1>
          </div>
          <div class="pointer-events-auto">
            <DifficultySelector
              activeDifficulty={difficulty()}
              onChange={(nextDifficulty) => {
                if (phase() === 'running') {
                  resetGame(nextDifficulty)
                } else {
                  setDifficulty(nextDifficulty)
                }
              }}
            />
          </div>
        </header>

        <div class="mt-auto flex items-end justify-between">
          <GameHud
            score={score()}
            phaseLabel={phaseLabel()}
            typedValue={currentInput()}
          />

          <div class="pointer-events-auto flex flex-col items-end gap-4">
            <button
              type="button"
              class="border border-white/10 bg-black/40 px-6 py-2 text-[10px] font-bold tracking-[0.3em] text-white/60 backdrop-blur-sm uppercase transition-all hover:border-white/40 hover:text-white"
              onClick={() => {
                if (phase() === 'running') {
                  resetGame()
                } else {
                  startGame()
                }
              }}
            >
              {phase() === 'running' ? '[ Reset ]' : phase() === 'game-over' ? '[ Reconnect ]' : '[ Initialize ]'}
            </button>
            <p class="text-[9px] tracking-widest text-white/20 uppercase">
              ESC to abort
            </p>
          </div>
        </div>
      </div>

      {/* Hidden input for focus handling */}
      <input
        ref={inputRef}
        value={currentInput()}
        class="absolute -left-[9999px] top-0 opacity-0"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        spellcheck={false}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default App
