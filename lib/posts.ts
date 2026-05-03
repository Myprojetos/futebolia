import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'

const postsDir = path.join(process.cwd(), 'content', 'posts')

export type Categoria = 'iGaming' | 'Turismo' | 'PMEs' | 'Viral'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  coverImage: string
  categoria: Categoria
  tags: string[]
  readingTime: string
  content?: string
}

export const categoriaConfig: Record<Categoria, { cor: string; label: string }> = {
  iGaming:  { cor: '#00A859', label: 'iGaming'  },
  Turismo:  { cor: '#0066FF', label: 'Turismo'  },
  PMEs:     { cor: '#FFD700', label: 'PMEs'     },
  Viral:    { cor: '#FF4444', label: 'Copa ao Vivo' },
}

function getFiles(): string[] {
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir).filter(f => /\.(md|mdx)$/.test(f))
}

export function getAllPosts(): Post[] {
  return getFiles()
    .map(fileName => {
      const slug = fileName.replace(/\.(md|mdx)$/, '')
      const raw = fs.readFileSync(path.join(postsDir, fileName), 'utf8')
      const { data, content } = matter(raw)
      const stats = readingTime(content)
      return {
        slug,
        title:       data.title      ?? '',
        date:        data.date       ?? '',
        excerpt:     data.excerpt    ?? '',
        coverImage:  data.coverImage ?? '/images/default-cover.jpg',
        categoria:   (data.categoria ?? 'iGaming') as Categoria,
        tags:        data.tags       ?? [],
        readingTime: `${Math.ceil(stats.minutes)} min`,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostsByCategoria(categoria: Categoria): Post[] {
  return getAllPosts().filter(p => p.categoria === categoria)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const file = getFiles().find(f => f.startsWith(slug + '.'))
  if (!file) return null

  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content)

  return {
    slug,
    title:       data.title      ?? '',
    date:        data.date       ?? '',
    excerpt:     data.excerpt    ?? '',
    coverImage:  data.coverImage ?? '/images/default-cover.jpg',
    categoria:   (data.categoria ?? 'iGaming') as Categoria,
    tags:        data.tags       ?? [],
    readingTime: `${Math.ceil(stats.minutes)} min`,
    content:     processed.toString(),
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}
