type StatsBarProps = {
  serverCount: number
  playerCount: number
}

export function StatsBar({ serverCount, playerCount }: StatsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-5 md:gap-8 md:py-6">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full bg-primary"
          aria-hidden="true"
        />
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{serverCount}</span> 台服务器在线
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full bg-player-blue"
          aria-hidden="true"
        />
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{playerCount}</span> 名玩家在线
        </span>
      </div>
    </div>
  )
}
