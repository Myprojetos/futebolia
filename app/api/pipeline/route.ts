import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

type Categoria = 'iGaming' | 'Turismo' | 'PMEs' | 'Viral'

interface PipelineRequest {
  categoria?: Categoria
  topic?: string
  skipApproval?: boolean  // only for emergency posts
}

// ─── 1. TREND (YouTube + Google Search) ──────────────────────────────────────

async function getTrend(categoria: Categoria): Promise<{ topico: string; keywords: string[]; angulo_editorial: string } | null> {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/trends?nicho=${categoria}`, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.recomendacao_do_dia ?? null
  } catch {
    return null
  }
}

// ─── 2. RESEARCH (Gemini 2.5 Flash) ──────────────────────────────────────────

async function research(categoria: Categoria, topic?: string, trend?: { topico: string; angulo_editorial: string } | null): Promise<string> {
  const context = trend ? `Tendência identificada: "${trend.topico}". Ângulo sugerido: "${trend.angulo_editorial}".` : ''
  const prompt = topic
    ? `Pesquise dados atualizados sobre: "${topic}". ${context} Retorne JSON: { "titulo_sugerido": string, "keywords": string[], "dados_relevantes": string[], "angulo_editorial": string, "cta_afiliado": string }`
    : `Identifique dados para o nicho "${categoria}" hoje (${new Date().toISOString().split('T')[0]}). ${context} Retorne JSON: { "titulo_sugerido": string, "topic": string, "keywords": string[], "dados_relevantes": string[], "angulo_editorial": string, "cta_afiliado": string }`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
      }),
    }
  )
  if (!res.ok) throw new Error(`Gemini research error: ${res.status}`)
  const data = await res.json()
  return data.candidates[0].content.parts[0].text
}

// ─── 3. WRITE (Claude Sonnet 4.6) ────────────────────────────────────────────

async function writeArticle(researchData: string, categoria: Categoria): Promise<{
  title: string; slug: string; excerpt: string; tags: string[]; content: string; imagePrompt: string
}> {
  const research = JSON.parse(researchData)

  const systemPrompt = `Você é o Copywriter da Futebolia — blog de IA aplicada à Copa 2026. Escreva em português brasileiro, tom especialista e amigável.
- Estrutura: gancho forte → problema → solução com IA → CTA
- Responder pergunta principal em ≤50 palavras logo após o H2
- Incluir ao menos 1 ferramenta de IA gratuita com dado de impacto
- Encerrar com CTA de afiliado natural
- iGaming: incluir aviso de jogo responsável (Lei 14.790/2023)
- Dados sempre com fonte citada`

  const userPrompt = `Escreva artigo completo para nicho "${categoria}" com base nesta pesquisa:
${JSON.stringify(research, null, 2)}

Retorne JSON:
{
  "title": "título SEO ≤60 chars",
  "slug": "slug-url-amigavel",
  "excerpt": "meta description 150-160 chars",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "content": "conteúdo completo em Markdown mínimo 800 palavras",
  "imagePrompt": "prompt inglês para thumbnail — cena visual sem texto"
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`)
  const data = await res.json()
  const text = data.content[0].text
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ?? text.match(/(\{[\s\S]*\})/)
  if (!jsonMatch) throw new Error('Claude did not return valid JSON')
  return JSON.parse(jsonMatch[1] ?? jsonMatch[0])
}

// ─── 4. IMAGE (Nanobanana API) ────────────────────────────────────────────────

async function generateCoverImage(imagePrompt: string): Promise<string> {
  const res = await fetch('https://nanobananaapi.ai/api/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NANOBANANA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `${imagePrompt}, professional photography, vibrant colors, high quality, 2026`,
      width: 1200,
      height: 630,
      model: 'nano-banana',
    }),
  })
  if (!res.ok) return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80'
  const data = await res.json()
  return data.url ?? data.image_url ?? 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80'
}

// ─── 5. REQUEST APPROVAL (Telegram) ──────────────────────────────────────────

async function requestApproval(article: {
  title: string; slug: string; excerpt: string; tags: string[]
  content: string; coverImage: string; categoria: Categoria
}): Promise<string> {
  const token     = crypto.randomBytes(16).toString('hex')
  const botToken  = process.env.TELEGRAM_BOT_TOKEN!
  const chatId    = process.env.TELEGRAM_CHAT_ID!
  const emoji     = { iGaming: '🎰', Turismo: '✈️', PMEs: '🏪', Viral: '🔥' }[article.categoria]
  const preview   = article.content.replace(/[#*_`]/g, '').slice(0, 200)

  const text = `${emoji} *Novo artigo para aprovação*\n\n*Título:* ${article.title}\n*Nicho:* ${article.categoria}\n*Tags:* ${article.tags.slice(0, 3).join(', ')}\n\n*Preview:*\n${preview}...\n\n🖼 [Ver thumbnail](${article.coverImage})`

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Publicar', callback_data: `approve:${token}` },
          { text: '❌ Rejeitar', callback_data: `reject:${token}` },
        ]],
      },
    }),
  })

  // Store pending approval in KV-compatible format via a simple endpoint
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  await fetch(`${baseUrl}/api/approval/store`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, type: 'article', payload: article }),
  })

  return token
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: PipelineRequest = {}
  try { body = await req.json() } catch { /* empty body ok */ }

  const categoria: Categoria = body.categoria ?? pickCategoria()
  const steps: string[] = []

  const telegram = (msg: string) => fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' }),
    }
  )

  try {
    // Step 1 — Trend analysis
    steps.push('trend')
    const trend = await getTrend(categoria)

    // Step 2 — Research
    steps.push('research')
    const researchData = await research(categoria, body.topic, trend)

    // Step 3 — Write
    steps.push('write')
    const article = await writeArticle(researchData, categoria)

    // Step 4 — Image
    steps.push('image')
    const coverImage = await generateCoverImage(article.imagePrompt)

    const fullArticle = { ...article, coverImage, categoria }

    // Step 5 — Approval or direct publish
    if (body.skipApproval) {
      steps.push('publish')
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
      const res = await fetch(`${baseUrl}/api/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.PUBLISH_SECRET}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(fullArticle),
      })
      const result = await res.json()
      await telegram(`✅ *Publicado automaticamente!*\n\n*${article.title}*\n\n🔗 ${result.url}`)
      return NextResponse.json({ ok: true, url: result.url, title: article.title, categoria, steps })
    } else {
      steps.push('approval_requested')
      const approvalToken = await requestApproval(fullArticle)
      return NextResponse.json({
        ok: true,
        status: 'aguardando_aprovacao',
        title: article.title,
        categoria,
        approvalToken,
        steps,
        message: 'Artigo criado. Verifique o Telegram para aprovar ou rejeitar.',
      })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const failedAt = steps[steps.length - 1] ?? 'init'
    await telegram(`⚠️ *Pipeline falhou* na etapa \`${failedAt}\`\n\nErro: ${message}`)
    return NextResponse.json({ ok: false, error: message, failedAt }, { status: 500 })
  }
}

function pickCategoria(): Categoria {
  const map: Record<number, Categoria> = { 0: 'Viral', 1: 'iGaming', 2: 'Turismo', 3: 'iGaming', 4: 'Turismo', 5: 'PMEs', 6: 'Viral' }
  return map[new Date().getDay()] ?? 'iGaming'
}
