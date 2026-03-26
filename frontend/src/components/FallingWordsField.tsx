import type { FallingWord } from '../utils/fallingWords'

type FallingWordsFieldProps = {
  words: FallingWord[]
  currentInput: string
  phase: 'idle' | 'running' | 'game-over'
  score: number
  onFieldClick: () => void
}

function FallingWordsField(props: FallingWordsFieldProps) {
  const focusedWordId = () => {
    if (props.currentInput.length === 0) {
      return null
    }

    const candidates = props.words
      .filter((word) => word.text.startsWith(props.currentInput))
      .sort((left, right) => right.y - left.y)

    return candidates[0]?.id ?? null
  }

  return (
    <div
      class="fixed inset-0 z-0 h-screen w-screen cursor-crosshair overflow-hidden bg-black"
      onClick={props.onFieldClick}
    >
      {/* Background depth effects */}
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#111_0%,#000_100%)] opacity-50" />
      
      {/* Scanline effect for modern monochrome look */}
      <div class="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20" />

      {props.phase === 'idle' && (
        <div class="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div class="max-w-xl">
            <h2 class="text-6xl font-extralight tracking-tighter text-white sm:text-8xl">
              VOID<span class="opacity-20">TYPE</span>
            </h2>
            <p class="mt-8 text-[11px] font-medium tracking-[0.4em] text-white/40 uppercase">
              Press Enter to start the descent
            </p>
          </div>
        </div>
      )}

      {props.phase === 'game-over' && (
        <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div class="text-center">
            <p class="text-[11px] font-medium tracking-[0.5em] text-white/30 uppercase">
              Connection Lost
            </p>
            <p class="mt-4 text-9xl font-extralight tracking-tighter text-white">
              {props.score.toString().padStart(3, '0')}
            </p>
            <p class="mt-8 text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
              Press Enter to reconnect
            </p>
          </div>
        </div>
      )}

      {props.words.map((word) => {
        const isFocused = word.id === focusedWordId()
        const isPrefixMatch =
          props.currentInput.length > 0 && word.text.startsWith(props.currentInput)
        const isExactMatch =
          props.currentInput.length > 0 && word.text === props.currentInput
        const typedLength = isFocused ? props.currentInput.length : 0
        const characters = word.text.split('')

        return (
          <div
            class={`absolute font-mono text-2xl tracking-tighter transition-all duration-150 ${
              isExactMatch
                ? 'text-white brightness-150'
                : isFocused
                  ? 'text-white'
                  : isPrefixMatch
                  ? 'text-white/60'
                  : 'text-white/20'
            }`}
            style={{
              transform: `translate(${word.x}px, ${word.y}px) rotate(${word.rotation}deg)`,
              filter: isFocused ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none'
            }}
          >
            <span class="relative inline-flex items-center">
              {characters.map((character, index) => {
                const isTyped = isFocused && index < typedLength
                const isCaretSlot = isFocused && index === typedLength

                return (
                  <span
                    class={`relative transition-colors duration-200 ${
                      isTyped
                        ? 'text-white font-bold'
                        : isCaretSlot
                          ? 'text-white/40'
                          : 'text-inherit'
                    }`}
                  >
                    {isCaretSlot && (
                      <span class="absolute bottom-[-2px] left-0 h-[1px] w-full bg-white opacity-50" />
                    )}
                    {character}
                  </span>
                )
              })}

              {isFocused && typedLength === characters.length && (
                <span class="ml-[1px] h-[1em] w-[1px] bg-white opacity-80" />
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default FallingWordsField
