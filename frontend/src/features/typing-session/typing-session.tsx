import type { GameDefinition } from '../../entities/game/types'
import DifficultySelector from './components/difficulty-selector'
import FallingWordsField from './components/falling-words-field'
import GameHud from './components/game-hud'
import { useTypingSession } from './use-typing-session'

type TypingSessionProps = {
  game: GameDefinition
}

function TypingSession(props: TypingSessionProps) {
  const session = useTypingSession(props.game)

  return (
    <div class="relative h-screen w-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      <div class="absolute inset-0 z-0">
        <FallingWordsField
          words={session.activeWords()}
          currentInput={session.currentInput()}
          phase={session.phase()}
          score={session.score()}
          onFieldClick={session.focusInput}
        />
      </div>

      <div class="pointer-events-none relative z-10 flex h-full flex-col p-8 sm:p-12">
        <header class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="text-xs font-bold tracking-[0.5em] text-white opacity-40 uppercase">
              Void Protocol v1.0
            </h1>
          </div>
          <div class="pointer-events-auto">
            <DifficultySelector
              activeDifficulty={session.difficulty()}
              onChange={session.handleDifficultyChange}
            />
          </div>
        </header>

        <div class="mt-auto flex items-end justify-between">
          <GameHud
            score={session.score()}
            phaseLabel={session.phaseLabel()}
            typedValue={session.currentInput()}
          />

          <div class="pointer-events-auto flex flex-col items-end gap-4">
            <button
              type="button"
              class="border border-white/10 bg-black/40 px-6 py-2 text-[10px] font-bold tracking-[0.3em] text-white/60 backdrop-blur-sm uppercase transition-all hover:border-white/40 hover:text-white"
              onClick={() => {
                if (session.phase() === 'running') {
                  session.resetGame()
                } else {
                  session.startGame()
                }
              }}
            >
              {session.phase() === 'running'
                ? '[ Reset ]'
                : session.phase() === 'game-over'
                  ? '[ Reconnect ]'
                  : '[ Initialize ]'}
            </button>
            <p class="text-[9px] tracking-widest text-white/20 uppercase">
              ESC to abort
            </p>
          </div>
        </div>
      </div>

      <input
        ref={session.setInputRef}
        value={session.currentInput()}
        class="absolute -left-[9999px] top-0 opacity-0"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        spellcheck={false}
        onInput={session.handleInput}
        onKeyDown={session.handleKeyDown}
      />
    </div>
  )
}

export default TypingSession
