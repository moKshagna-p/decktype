import {
  difficultyOptions,
  type DifficultyKey,
} from '../utils/fallingWords'

type DifficultySelectorProps = {
  activeDifficulty: DifficultyKey
  onChange: (difficulty: DifficultyKey) => void
}

function DifficultySelector(props: DifficultySelectorProps) {
  return (
    <div class="flex items-center gap-1 rounded-sm border border-[#222] bg-black/40 p-1 backdrop-blur-sm">
      {difficultyOptions.map((option) => {
        const isActive = option.key === props.activeDifficulty

        return (
          <button
            type="button"
            class={`rounded-sm px-3 py-1 text-[11px] font-medium tracking-widest uppercase transition-all duration-300 ${
              isActive
                ? 'bg-white text-black'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => props.onChange(option.key)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default DifficultySelector
