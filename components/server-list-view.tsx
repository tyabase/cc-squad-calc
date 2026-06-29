"use client"

import { useState } from "react"
import { StatsBar } from "@/components/stats-bar"
import { ServerTable } from "@/components/server-table"
import type { ServerRow } from "@/lib/squad"

type InitialData = {
  servers: ServerRow[]
  totalPlayers: number
  activeCount: number
  fetchedAt: number
} | null

export function ServerListView({ initialData, error }: { initialData: InitialData, error: string | null }) {
  const [showEmpty, setShowEmpty] = useState(false)

  if (!initialData) {
    return (
      <section className="mx-auto max-w-[1400px] px-4 pb-16 md:px-6">
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-6 py-10 text-center text-sm text-foreground">
          {error || "数据加载失败，数据源可能暂时不可用。请稍后重试。"}
        </div>
      </section>
    )
  }

  const visibleServers = showEmpty
    ? initialData.servers
    : initialData.servers.filter((s) => s.players > 0)

  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-16 md:px-6">
      <StatsBar
        serverCount={initialData.activeCount}
        playerCount={initialData.totalPlayers}
      />

      <div className="mb-4 flex items-center justify-end">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showEmpty}
            onChange={(e) => setShowEmpty(e.target.checked)}
            className="h-4 w-4 rounded border-border bg-card accent-primary"
          />
          显示空服务器
        </label>
      </div>

      {visibleServers.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground">
          当前没有在线玩家的服务器，勾选「显示空服务器」查看全部。
        </div>
      ) : (
        <ServerTable servers={visibleServers} />
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground/70">
        每 60 秒自动刷新 · 最近更新{" "}
        {new Date(initialData.fetchedAt).toLocaleTimeString("zh-CN")}
      </p>
    </section>
  )
}
