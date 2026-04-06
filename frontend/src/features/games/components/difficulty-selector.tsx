import { cn } from '@/lib/cn'

export type DifficultyOption<T extends string> = {
  key: T
  label: string
}

type DifficultySelectorProps<T extends string> = {
  options: DifficultyOption<T>[]
  activeDifficulty: T
  onChange: (difficulty: T) => void
}

export function DifficultySelector<T extends string>(props: DifficultySelectorProps<T>) {
  return (
    <div class="t-label flex items-center gap-1 rounded-xl bg-(--sub-alt) px-2 py-1.5 font-bold uppercase tracking-widest transition-all">
      {props.options.map((option) => (
        <button
          type="button"
          class={cn(
            'rounded-md px-4 py-2 uppercase',
            option.key === props.activeDifficulty
              ? 'text-(--text)'
              : 'text-(--sub) hover:text-(--text)',
          )}
          onClick={() => props.onChange(option.key)}
        >
          {option.label.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
