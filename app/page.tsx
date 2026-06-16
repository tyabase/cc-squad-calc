import { SiteHeader } from "@/components/site-header"
import { ServerListView } from "@/components/server-list-view"
import { type ServerRow } from "@/lib/squad"

const UPSTREAM_URL = process.env.SQUAD_API_URL || "https://www.squad.wiki/servers.php"

function parseHtmlTable(html: string): ServerRow[] {
  const servers: ServerRow[] = []
  
  // 匹配表格行的正则表达式
  const rowRegex = /\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|/g
  
  // 检查是否包含中文字符的正则表达式
  const chineseRegex = /[\u4e00-\u9fff]/
  
  let match
  while ((match = rowRegex.exec(html)) !== null) {
    const name = match[1].trim()
    const map = match[2].trim()
    const playersStr = match[4].trim()
    
    // 跳过表头
    if (name.includes("服务器名") || name.includes("地图") || name.includes("模式")) {
      continue
    }
    
    // 只保留含有中文字符的服务器
    if (!chineseRegex.test(name)) {
      continue
    }
    
    // 解析玩家数 (格式: "99 +9" 或 "100/100")
    const playersMatch = playersStr.match(/(\d+)/)
    const players = playersMatch ? parseInt(playersMatch[1], 10) : 0
    
    // 估算最大玩家数 (通常是 100 或 99)
    const maxPlayers = players >= 99 ? 100 : 100
    
    servers.push({
      id: `wiki-${servers.length}-${name}`,
      name: name.replace(/认证服/g, "").trim(),
      map: map.split("_")[0],
      players,
      maxPlayers,
      uptimeSec: 0,
      isBot: false,
    })
  }
  
  return servers
}

async function fetchServers(): Promise<{ servers: ServerRow[], totalPlayers: number, activeCount: number, fetchedAt: number }> {
  const res = await fetch(UPSTREAM_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    },
    cache: "no-store",
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error("数据服务暂时不可用")
  }

  const html = await res.text()
  const servers = parseHtmlTable(html)
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
