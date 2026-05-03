import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * POST /api/publish
 * Endpoint para o Publisher Agent criar artigos via GitHub API.
 * Em produção (Vercel), use a GitHub API diretamente — este endpoint
 * é para desenvolvimento local apenas.
 *
 * Body: { slug, title, date, categoria, excerpt, coverImage, tags, content }
 * Header: Authorization: Bearer <PUBLISH_SECRET>
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const secret = process.env.PUBLISH_SECRET

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { slug, title, date, categoria, excerpt, coverImage, tags, content } = body

  if (!slug || !title || !content) {
    return NextResponse.json({ error: 'slug, title e content são obrigatórios' }, { status: 400 })
  }

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `date: "${date ?? new Date().toISOString().split('T')[0]}"`,
    `categoria: "${categoria ?? 'iGaming'}"`,
    `excerpt: "${excerpt ?? ''}"`,
    `coverImage: "${coverImage ?? '/images/default-cover.jpg'}"`,
    `tags: [${(tags ?? []).map((t: string) => `"${t}"`).join(', ')}]`,
    '---',
    '',
  ].join('\n')

  const postsDir = path.join(process.cwd(), 'content', 'posts')
  fs.mkdirSync(postsDir, { recursive: true })
  fs.writeFileSync(path.join(postsDir, `${slug}.md`), frontmatter + content)

  return NextResponse.json({ ok: true, slug, url: `/${slug}` })
}
