export type RawServerDetails = {
  SERVERNAME_s?: string
  MAPNAME_s?: string
  PLAYERCOUNT_l?: number
  PLAYTIME_l?: number
  GAMEMODE_s?: string
  TEAMONE_s?: string
  TEAMTWO_s?: string
  GAMEMODE_s?: string
  NEXTLAYER_s?: string
  [key: string]: any
}

export type RawServer = {
  followId: string
  name: string
  players: number
  maxPlayers: number
  status: string
  country: string
  currentLayerRaw: string
  gameMode: string
  parsedMapName: string | null
  layerVersion: string | null
  teamOneShort: string
  teamTwoShort: string
  nextLayer: string
  sourceUpdatedAt: string | null
  details: RawServerDetails
  createdAt: string
  updatedAt: string
}

export type ServerRow = {
  id: string
  name: string
  map: string
  players: number
  maxPlayers: number
  uptimeSec: number
  isBot: boolean
}

// Squad 地图原始 key -> 中文名（取地图基础名，忽略模式/版本后缀）
const MAP_NAMES: Record<string, string> = {
  Gorodok: "戈罗多克",
  Yehorivka: "叶霍罗夫卡",
  Albasrah: "阿尔巴斯拉",
  AlBasrah: "阿尔巴斯拉",
  Narva: "纳尔瓦",
  Fallujah: "费卢杰",
  Mutaha: "穆塔哈",
  Belaya: "贝拉亚",
  Tallil: "塔里尔",
  Chora: "乔拉",
  Kohat: "科哈特",
  Kokan: "科坎",
  Lashkar: "拉什卡尔",
  Logar: "洛加尔山谷",
  Manic: "马尼克",
  Manicouagan: "马尼夸根",
  Mestia: "梅斯蒂亚",
  Sumari: "苏马里",
  Skorpo: "斯科尔波",
  Anvil: "铁砧",
  Harju: "哈尔尤",
  GooseBay: "鹅湾",
  BlackCoast: "黑色海岸",
  Sanxian: "三仙岛",
  Pacific: "太平洋",
  Jensen: "詹森训练场",
  JensensRange: "詹森训练场",
  Tutorial: "教程地图",
  Fool: "愚人岛",
  FoolsRoad: "愚人之路",
}

export function translateMap(rawMap: string): string {
  if (!rawMap) return "未知地图"
  const base = rawMap.split("_")[0]
  if (MAP_NAMES[base]) return MAP_NAMES[base]
  // 处理像 "AlBasrah" 不带下划线的情况
  for (const key of Object.keys(MAP_NAMES)) {
    if (base.toLowerCase() === key.toLowerCase()) return MAP_NAMES[key]
  }
  return base
}

export function formatUptime(sec: number): string {
  if (!sec || sec <= 0) return "未开局"
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, "0")}min`
  }
  return `${m}min`
}

export function normalizeServers(raw: RawServer[]): ServerRow[] {
  return raw.map((s, i) => ({
    id: `${i}-${s.followId || s.name}`,
    name: s.name?.trim() || "(未命名服务器)",
    map: translateMap(s.parsedMapName || s.currentLayerRaw || s.details?.MAPNAME_s || ""),
    players: s.players ?? s.details?.PLAYERCOUNT_l ?? 0,
    maxPlayers: s.maxPlayers ?? 100,
    uptimeSec: s.details?.PLAYTIME_l ?? 0,
    isBot: false,
  }))
}
