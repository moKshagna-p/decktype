import { ArrowRight } from 'lucide-solid'
import { Card } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import type { GameId } from '@/features/games/types'

type GameCardProps = {
  name: string
  description: string
  id: GameId
  onClick: () => void
}

export function GameCard(props: GameCardProps) {
  return (
    <Card
      as="button"
      type="button"
      class="group relative flex flex-col items-start gap-6 p-10 text-left transition-all"
      onClick={props.onClick}
    >
      <div class="flex flex-col gap-3">
        <Typography
          variant="title"
          tracking="tight"
          class="group-hover:text-(--main) transition-colors"
        >
          {props.name.toLowerCase()}
        </Typography>
        <Typography
          variant="body"
          color="sub"
          class="leading-relaxed"
        >
          {props.description.toLowerCase()}
        </Typography>
      </div>

      <div class="absolute bottom-10 right-10 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
        <ArrowRight size={20} strokeWidth={3} class="text-(--main)" />
      </div>
    </Card>
  )
}
