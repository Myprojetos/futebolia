import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface PublishPayload {
  title: string
  slug: string
  date?: string
  categoria?: 'iGaming' | 'Turismo' | 'PMEs' | 'Viral'
  excerpt?: string
  coverImage?: string
  tags?: string[]
  content: string
}

async function publishToGitHub(payload: PublishPayload): Promise<{ url: string }> {
  const token  = process.env.GITHUB_TOKEN!
  const owner  = process.env.GITHUB_OWNER!
  const repo   = process.env.GITHUB_REPO!
  const branch = process.env.GITHUB_BRANCH ?? 'master'
  const filePath = `site/content/posts/${payload.slug}.md`

  const date      = payload.date ?? new Date().toISOString().split('T')[0]
  const categoria = payload.categoria ?? 'iGaming'
  const excerpt   = (payload.excerpt ?? '').replace(/"/g, '\\"')
  const cover     = payload.coverImage ?? 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80'
  const tags      = (payload.tags ?? []).map(t => `"${t}"`).join(', ')
  const title     = payload.title.replace(/"/g, '\\"')

  const fileContent = `---
title: "${title}"
date: "${date}"
categoria: "${categoria}"
excerpt: "${excerpt}"
coverImage: "${cover}"
tags: [${tags}]
---

${payload.content}`

  const encoded = Buffer.from(fileContent).toString('base64')

  // Check if file already exists (need SHA for updates)
  let sha: string | undefined
  const check = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
  )
  if (check.ok) {
    const existing = await check.json()
    sha = existing.sha
  }

  const body: Record<string, unknown> = {
    message: `post: ${payload.title}`,
    content: encoded,
    branch,
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub error ${res.status}: ${err}`)
  }

  return { url: `https://futebolia.com.br/posts/${payload.slug}` }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.PUBLISH_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: PublishPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (!payload.slug || !payload.title || !payload.content) {
    return NextResponse.json({ error: 'slug, title e content são obrigatórios' }, { status: 400 })
  }

  try {
    const result = await publishToGitHub(payload)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
