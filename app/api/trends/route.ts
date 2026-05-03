import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Nicho = 'iGaming' | 'Turismo' | 'PMEs' | 'Viral'

const KEYWORDS: Record<Nicho, string[]> = {
  iGaming:  ['apostas Copa 2026', 'micro mercados apostas', 'odds Copa 2026', 'bet Copa do Mundo'],
  Turismo:  ['viagem Copa 2026', 'hotéis Copa 2026', 'turismo EUA 2026', 'ingressos Copa 2026'],
  PMEs:     ['IA para pequenas empresas', 'marketing digital Copa 2026', 'vendas Copa 2026'],
  Viral:    ['Copa 2026 gols', 'seleção brasileira 2026', 'futebol Copa do Mundo 2026', 'Copa 2026 grupos'],
}

interface YouTubeTrend {
  videoId: string
  title: string
  views: string
  likes: string
  channelTitle: string
  publishedAt: string
  thumbnailUrl: string
  duration: string
}

interface SearchTrend {
  title: string
  url: string
  snippet: string
  source: string
}

async function searchYouTubeShorts(keyword: string): Promise<YouTubeTrend[]> {
  const apiKey = process.env.YOUTUBE_API_KEY!

  // Search for recent Shorts
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword + ' #shorts')}&type=video&videoDuration=short&order=viewCount&publishedAfter=${sevenDaysAgo()}&maxResults=5&key=${apiKey}`
  )
  if (!searchRes.ok) return []
  const searchData = await searchRes.json()
  if (!searchData.items?.length) return []

  const videoIds = searchData.items.map((i: { id: { videoId: string } }) => i.id.videoId).join(',')

  // Get statistics
  const statsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${apiKey}`
  )
  if (!statsRes.ok) return []
  const statsData = await statsRes.json()

  return (statsData.items ?? []).map((v: {
    id: string
    snippet: { title: string; channelTitle: string; publishedAt: string; thumbnails: { high: { url: string } } }
    statistics: { viewCount?: string; likeCount?: string }
    contentDetails: { duration: string }
  }) => ({
    videoId:      v.id,
    title:        v.snippet.title,
    views:        v.statistics.viewCount ?? '0',
    likes:        v.statistics.likeCount ?? '0',
    channelTitle: v.snippet.channelTitle,
    publishedAt:  v.snippet.publishedAt,
    thumbnailUrl: v.snippet.thumbnails?.high?.url ?? '',
    duration:     v.contentDetails.duration,
  }))
}

async function searchGoogleTrends(keyword: string): Promise<SearchTrend[]> {
  const apiKey  = process.env.GOOGLE_SEARCH_API_KEY!
  const cx      = process.env.GOOGLE_SEARCH_ENGINE_ID!

  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(keyword)}&cx=${cx}&key=${apiKey}&num=5&sort=date`
  )
  if (!res.ok) return []
  const data = await res.json()

  return (data.items ?? []).map((item: { title: string; link: string; snippet: string; displayLink: string }) => ({
    title:   item.title,
    url:     item.link,
    snippet: item.snippet,
    source:  item.displayLink,
  }))
}

async function analyzeWithGemini(nicho: Nicho, youtubeData: YouTubeTrend[], searchData: SearchTrend[]): Promise<{
  topico: string
  angulo_editorial: string
  keywords: string[]
  urgencia: 'alta' | 'media' | 'baixa'
  formato_recomendado: string
  imagePrompt: string
}> {
  const prompt = `Você é um estrategista de conteúdo digital especializado em Copa 2026 e IA.

Analise estes dados de tendência para o nicho "${nicho}":

YOUTUBE SHORTS em alta (últimos 7 dias):
${JSON.stringify(youtubeData.slice(0, 3), null, 2)}

ARTIGOS em alta (Google):
${JSON.stringify(searchData.slice(0, 3), null, 2)}

Com base nessa análise, retorne um JSON com:
{
  "topico": "tópico específico e acionável para criar conteúdo HOJE",
  "angulo_editorial": "ângulo único da Futebolia — como abordar diferente do que já existe",
  "keywords": ["kw principal", "kw2", "kw3", "kw4"],
  "urgencia": "alta | media | baixa",
  "formato_recomendado": "artigo SEO | short 60s | carrossel 5 slides | thread",
  "imagePrompt": "prompt em inglês para gerar thumbnail no Nanobanana (cena visual, sem texto)"
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.8 },
      }),
    }
  )
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json()
  return JSON.parse(data.candidates[0].content.parts[0].text)
}

function sevenDaysAgo(): string {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const nichoParam = req.nextUrl.searchParams.get('nicho') as Nicho | null
  const nichos: Nicho[] = nichoParam ? [nichoParam] : ['iGaming', 'Turismo', 'PMEs', 'Viral']

  const results = []

  for (const nicho of nichos) {
    const keywords = KEYWORDS[nicho]
    const keyword  = keywords[Math.floor(Math.random() * keywords.length)]

    const [youtubeData, searchData] = await Promise.all([
      searchYouTubeShorts(keyword).catch(() => [] as YouTubeTrend[]),
      searchGoogleTrends(keyword).catch(() => [] as SearchTrend[]),
    ])

    const analysis = await analyzeWithGemini(nicho, youtubeData, searchData).catch(() => null)
    if (!analysis) continue

    results.push({
      nicho,
      keyword_usada: keyword,
      ...analysis,
      evidencias: {
        youtube_top: youtubeData[0] ?? null,
        search_top:  searchData[0] ?? null,
      },
    })
  }

  return NextResponse.json({
    ok: true,
    data: new Date().toISOString().split('T')[0],
    tendencias: results,
    recomendacao_do_dia: results.find(r => r.urgencia === 'alta') ?? results[0] ?? null,
  })
}
