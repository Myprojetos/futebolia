import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import { sendTelegram, buildDailyReport } from '@/lib/telegram'
import { getTotalClicks, getTopArticle, checkSiteHealth } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts    = getAllPosts()
  const today    = new Date().toISOString().split('T')[0]
  const weekAgo  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const postsToday = posts
    .filter(p => p.date === today)
    .map(p => ({ title: p.title, categoria: p.categoria }))

  const postsWeek = posts.filter(p => new Date(p.date) >= weekAgo).length

  const [siteOk, totalClicks, topArticle] = await Promise.all([
    checkSiteHealth(),
    Promise.resolve(getTotalClicks()),
    Promise.resolve(getTopArticle()),
  ])

  const alerts: string[] = []
  if (!siteOk)             alerts.push('Site não está respondendo — verificar Vercel')
  if (postsToday.length === 0) alerts.push('Nenhum artigo publicado hoje')
  if (posts.length > 0) {
    const lastPost = new Date(posts[0].date)
    const hoursSinceLast = (Date.now() - lastPost.getTime()) / 3600000
    if (hoursSinceLast > 48) alerts.push(`Último artigo foi há ${Math.floor(hoursSinceLast)}h`)
  }

  const message = buildDailyReport({
    postsToday,
    postsWeek,
    postsTotal: posts.length,
    affiliateClicks: totalClicks,
    topArticle,
    siteOk,
    alerts,
  })

  const sent = await sendTelegram(message)

  return NextResponse.json({
    ok: true,
    sent,
    postsToday: postsToday.length,
    postsTotal: posts.length,
    alerts,
  })
}
