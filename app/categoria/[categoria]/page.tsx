import { getAllPosts, categoriaConfig, type Categoria } from '@/lib/posts'
import ArticleCard from '@/components/ArticleCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const slugMap: Record<string, Categoria> = {
  igaming: 'iGaming',
  turismo: 'Turismo',
  pmes:    'PMEs',
  viral:   'Viral',
}

interface Props {
  params: Promise<{ categoria: string }>
}

export function generateStaticParams() {
  return Object.keys(slugMap).map(c => ({ categoria: c }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  const cat = slugMap[categoria]
  if (!cat) return {}
  const cfg = categoriaConfig[cat]
  return {
    title: `${cfg.label} — Copa IA 2026`,
    description: `Artigos sobre ${cfg.label} com Inteligência Artificial na Copa do Mundo 2026.`,
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params
  const cat = slugMap[categoria]
  if (!cat) notFound()

  const cfg = categoriaConfig[cat]
  const posts = getAllPosts().filter(p => p.categoria === cat)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-10">
        <span
          className="inline-block text-xs font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md mb-4"
          style={{ background: `${cfg.cor}22`, color: cfg.cor }}
        >
          {cfg.label}
        </span>
        <h1 className="font-heading font-extrabold text-4xl tracking-tight text-texto">
          {cfg.label}
        </h1>
        <p className="text-muted font-body mt-2">
          {posts.length} artigo{posts.length !== 1 ? 's' : ''} publicado{posts.length !== 1 ? 's' : ''}
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted font-body">
          <p className="text-5xl mb-4">⚽</p>
          <p>Nenhum artigo publicado nesta categoria ainda.</p>
        </div>
      )}
    </div>
  )
}
