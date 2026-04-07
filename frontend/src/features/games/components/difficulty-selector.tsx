import { cn } from '@/lib/cn'
import { Text } from '@/components/ui/text'

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
    <div class="flex items-center gap-1 rounded-xl bg-(--sub-alt) px-2 py-1.5 transition-all">
      {props.options.map((option) => (
        <button
          type="button"
          class={cn(
            'rounded-md px-4 py-2',
            option.key === props.activeDifficulty
              ? 'text-(--text)'
              : 'text-(--sub) hover:text-(--text)',
          )}
          onClick={() => props.onChange(option.key)}
        >
          <Text variant="label" upper>{option.label}</Text>
        </button>
      ))}
    </div>
  )
}
