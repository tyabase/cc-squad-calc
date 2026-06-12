import { SiteHeader } from "@/components/site-header"
import { ServerListView } from "@/components/server-list-view"
import { normalizeServers, type RawServer, type ServerRow } from "@/lib/squad"
import { Agent } from "node:https"

const UPSTREAM_URL = process.env.SQUAD_API_URL

async function fetchServers(): Promise<{ servers: ServerRow[], totalPlayers: number, activeCount: number, fetchedAt: number }> {
  if (!UPSTREAM_URL) {
    throw new Error("服务配置异常")
  }

  const isHttps = UPSTREAM_URL.startsWith('https://')
  const agent = isHttps ? new Agent({ rejectUnauthorized: false }) : undefined

  const res = await fetch(UPSTREAM_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0",
      Accept: "application/json",
      Referer: "https://squad-servers.example.com/",
    },
    // @ts-ignore - agent is not in the standard fetch types but works in Node.js
    agent,
    cache: "no-store",
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error("数据服务暂时不可用")
  }

  const data = (await res.json()) as { servers?: RawServer[] }
  const rawServers = Array.isArray(data.servers) ? data.servers : []
  const servers = normalizeServers(rawServers)
  servers.sort((a, b) => b.players - a.players)

  return {
    servers,
    totalPlayers: servers.reduce((sum, s) => sum + s.players, 0),
    activeCount: servers.filter((s) => s.players > 0).length,
    fetchedAt: Date.now(),
  }
}

export default async function Page() {
  let data: Awaited<ReturnType<typeof fetchServers>> | null = null
  let error: string | null = null

  try {
    data = await fetchServers()
  } catch (e) {
    error = e instanceof Error ? e.message : "未知错误"
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <ServerListView 
        initialData={data} 
        error={error}
      />
    </main>
  )
}
