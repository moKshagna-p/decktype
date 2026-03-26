type GameHudProps = {
  score: number
  phaseLabel: string
  typedValue: string
}

function GameHud(props: GameHudProps) {
  return (
    <div class="flex items-center gap-10">
      <div class="flex flex-col">
        <span class="text-[10px] font-medium tracking-[0.3em] text-white/30 uppercase">
          Score
        </span>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-light tracking-tight text-white/90">
            {props.score.toString().padStart(3, '0')}
          </span>
          <span class="text-[10px] text-white/20">PTS</span>
        </div>
      </div>

      <div class="flex flex-col">
        <span class="text-[10px] font-medium tracking-[0.3em] text-white/30 uppercase">
          Input
        </span>
        <span class="font-mono text-2xl tracking-tight text-white">
          {props.typedValue || '---'}
        </span>
      </div>

      <div class="flex flex-col">
        <span class="text-[10px] font-medium tracking-[0.3em] text-white/30 uppercase">
          Status
        </span>
        <span class="text-sm font-medium tracking-widest text-white/50 uppercase">
          {props.phaseLabel}
        </span>
      </div>
    </div>
  )
}

export default GameHud
