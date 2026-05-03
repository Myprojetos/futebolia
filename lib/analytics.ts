import fs from 'fs'
import path from 'path'

const statsFile = path.join(process.cwd(), 'data', 'stats.json')

interface Stats {
  affiliateClicks: Record<string, number>
  topArticle: string
  lastUpdated: string
}

function readStats(): Stats {
  try {
    if (!fs.existsSync(statsFile)) return { affiliateClicks: {}, topArticle: '', lastUpdated: '' }
    return JSON.parse(fs.readFileSync(statsFile, 'utf8'))
  } catch {
    return { affiliateClicks: {}, topArticle: '', lastUpdated: '' }
  }
}

function writeStats(stats: Stats) {
  const dir = path.dirname(statsFile)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2))
}

export function trackClick(slug: string) {
  const stats = readStats()
  stats.affiliateClicks[slug] = (stats.affiliateClicks[slug] ?? 0) + 1
  stats.topArticle = Object.entries(stats.affiliateClicks)
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? ''
  stats.lastUpdated = new Date().toISOString()
  writeStats(stats)
}

export function getTotalClicks(): number {
  const stats = readStats()
  return Object.values(stats.affiliateClicks).reduce((a, b) => a + b, 0)
}

export function getTopArticle(): string {
  return readStats().topArticle
}

export async function checkSiteHealth(): Promise<boolean> {
  try {
    const res = await fetch('https://futebolia.com.br', { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}
