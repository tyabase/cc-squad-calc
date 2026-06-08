import { formatUptime, type ServerRow } from "@/lib/squad"
import { cn } from "@/lib/utils"
import { MarqueeText } from "@/components/marquee-text"

function PlayerBar({
  players,
  max,
  className,
}: {
  players: number
  max: number
  className?: string
}) {
  const pct = Math.min(100, Math.round((players / Math.max(1, max)) * 100))
  let barColor = "bg-green-500"
  if (pct >= 96) {
    barColor = "bg-red-500"
  } else if (pct >= 85) {
    barColor = "bg-yellow-500"
  }
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="w-[3.75rem] shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
        {players}/{max}
      </span>
      {/* 固定宽度的人数条 */}
      <div className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-track">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      className={cn(
        "h-2 w-2 shrink-0 rounded-full",
        online ? "bg-primary shadow-[0_0_6px_var(--color-primary)]" : "bg-muted-foreground/40",
      )}
      aria-hidden="true"
    />
  )
}

const GRID = "grid grid-cols-[minmax(0,1fr)_120px_180px_88px] items-center gap-4"

/* ---------- 桌面端：表格行 ---------- */
function DesktopRow({ server, last }: { server: ServerRow; last: boolean }) {
  const online = server.players > 0
  return (
    <div
      className={cn(
        GRID,
        "px-6 py-4 transition-colors hover:bg-secondary/40",
        !last && "border-b border-border",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <StatusDot online={online} />
        <MarqueeText text={server.name} className="text-sm font-medium text-foreground" />
      </div>
      <span className="truncate text-sm text-muted-foreground">{server.map}</span>
      <PlayerBar players={server.players} max={server.maxPlayers} />
      <span className="text-right text-sm tabular-nums text-muted-foreground">
        {formatUptime(server.uptimeSec)}
      </span>
    </div>
  )
}

/* ---------- 移动端：卡片 ---------- */
function MobileCard({ server, last }: { server: ServerRow; last: boolean }) {
  const online = server.players > 0
  return (
    <div className={cn("px-4 py-3.5", !last && "border-b border-border")}>
      <div className="flex items-center gap-2.5">
        <StatusDot online={online} />
        <MarqueeText text={server.name} className="text-sm font-medium text-foreground" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 pl-[18px]">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="shrink-0 text-muted-foreground/60">地图</span>
          <span className="truncate text-foreground/80">{server.map}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="text-muted-foreground/60">时长</span>
          <span className="tabular-nums text-foreground/80">{formatUptime(server.uptimeSec)}</span>
        </div>
      </div>
      <PlayerBar players={server.players} max={server.maxPlayers} className="mt-3 pl-[18px]" />
    </div>
  )
}

export function ServerTable({ servers }: { servers: ServerRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* 桌面端表头 */}
      <div className={cn(GRID, "hidden border-b border-border bg-secondary/30 px-6 py-3.5 md:grid")}>
        <span className="text-xs font-medium tracking-wide text-muted-foreground">服务器名称</span>
        <span className="text-xs font-medium tracking-wide text-muted-foreground">当前地图</span>
        <span className="text-xs font-medium tracking-wide text-muted-foreground">在线人数</span>
        <span className="text-right text-xs font-medium tracking-wide text-muted-foreground">
          开局时间
        </span>
      </div>

      {/* 桌面端列表 */}
      <div className="hidden md:block">
        {servers.map((server, i) => (
          <DesktopRow key={server.id} server={server} last={i === servers.length - 1} />
        ))}
      </div>

      {/* 移动端列表 */}
      <div className="md:hidden">
        {servers.map((server, i) => (
          <MobileCard key={server.id} server={server} last={i === servers.length - 1} />
        ))}
      </div>
    </div>
  )
}
