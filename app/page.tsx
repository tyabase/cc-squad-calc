import { SiteHeader } from "@/components/site-header"
import { ServerListView } from "@/components/server-list-view"
import { normalizeServers, type RawServer, type ServerRow } from "@/lib/squad"

const UPSTREAM_URL = process.env.SQUAD_API_URL

const API_INPUT = encodeURIComponent(
  JSON.stringify({
    "0": {
      json: { search: null, limit: 200, cursor: 0 },
      meta: { values: { search: ["undefined"] } },
    },
  })
)

async function fetchServers(): Promise<{ servers: ServerRow[], totalPlayers: number, activeCount: number, fetchedAt: number }> {
  if (!UPSTREAM_URL) {
    throw new Error("服务配置异常")
  }

  const url = `${UPSTREAM_URL}?batch=1&input=${API_INPUT}`

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0",
      Accept: "application/json",
      Referer: "https://squadmaps.com/",
    },
    cache: "no-store",
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error("数据服务暂时不可用")
  }

  const data = await res.json()
  const items = data?.[0]?.result?.data?.json?.items || []
  const rawServers = Array.isArray(items) ? items : []
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
