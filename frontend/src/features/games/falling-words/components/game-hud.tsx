import { Text } from '@/components/ui/text'

type GameHudProps = {
  score: number
  typedValue: string
}

function GameHud(props: GameHudProps) {
  return (
    <div class="flex items-center gap-12 font-mono">
      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <Text variant="label" upper>score</Text>
        </div>
        <div class="text-(--main)">
          <Text variant="title">{props.score}</Text>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="opacity-50">
          <Text variant="label" upper>input</Text>
        </div>
        <Text variant="title">{props.typedValue || '...'}</Text>
      </div>
    </div>
  )
}

export default GameHud
