import { getAllPosts, getPostBySlug, categoriaConfig, formatDate } from '@/lib/posts'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const cfg = categoriaConfig[post.categoria]

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted font-body mb-8">
        <Link href="/" className="hover:text-verde transition-colors">Home</Link>
        <span>›</span>
        <Link
          href={`/categoria/${post.categoria.toLowerCase()}`}
          className="hover:text-verde transition-colors"
          style={{ color: cfg.cor }}
        >
          {cfg.label}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <span
          className="inline-block text-xs font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md mb-4"
          style={{ background: `${cfg.cor}22`, color: cfg.cor }}
        >
          {cfg.label}
        </span>
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl leading-tight tracking-tight text-texto mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted font-body">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readingTime} de leitura</span>
        </div>
      </header>

      {/* Cover image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-10">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Conteúdo */}
      <div
        className="prose prose-invert prose-lg max-w-none font-body"
        dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs font-body text-muted border border-border px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Back */}
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-verde hover:opacity-80 transition-opacity"
        >
          ← Voltar para o início
        </Link>
      </div>
    </article>
  )
}
