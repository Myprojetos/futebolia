import { getAllPosts, categoriaConfig, type Categoria } from '@/lib/posts'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'

export default function HomePage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  const categorias: Categoria[] = ['iGaming', 'Turismo', 'PMEs', 'Viral']

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Hero */}
      <section className="mb-16">
        <div className="mb-8">
          <span className="inline-block bg-verde/10 text-verde font-heading font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Copa do Mundo 2026 · IA
          </span>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl leading-tight tracking-tighter text-texto mb-4">
            Futebol com{' '}
            <span className="text-verde">Inteligência</span>
            <br />
            Artificial
          </h1>
          <p className="font-body text-lg text-muted max-w-xl leading-relaxed">
            Apostas, turismo e ferramentas de IA para você aproveitar
            ao máximo a Copa 2026.
          </p>
        </div>

        {/* Categorias rápidas */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categorias.map(cat => {
            const cfg = categoriaConfig[cat]
            return (
              <Link
                key={cat}
                href={`/categoria/${cat.toLowerCase()}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full border font-heading font-semibold text-sm transition-colors hover:opacity-80"
                style={{ borderColor: `${cfg.cor}40`, color: cfg.cor }}
              >
                {cfg.label}
              </Link>
            )
          })}
        </div>

        {/* Featured article */}
        {featured && <ArticleCard post={featured} featured />}
      </section>

      {/* Grid de artigos */}
      {rest.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-2xl tracking-tight">Últimos artigos</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center py-24 text-muted font-body">
          <p className="text-6xl mb-4">⚽</p>
          <p className="text-lg">Os agentes ainda estão preparando os primeiros artigos.</p>
          <p className="text-sm mt-2">Volte em breve.</p>
        </div>
      )}
    </div>
  )
}
