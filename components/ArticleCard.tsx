import Link from 'next/link'
import Image from 'next/image'
import { type Post, categoriaConfig, formatDate } from '@/lib/posts'

interface Props {
  post: Post
  featured?: boolean
}

export default function ArticleCard({ post, featured = false }: Props) {
  const cfg = categoriaConfig[post.categoria]

  if (featured) {
    return (
      <Link href={`/${post.slug}`} className="group block">
        <article className="grid md:grid-cols-2 gap-8 bg-card rounded-2xl overflow-hidden border border-border hover:border-verde/40 transition-colors">
          <div className="relative aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50" />
          </div>
          <div className="flex flex-col justify-center gap-4 p-8">
            <span
              className="inline-block w-fit text-xs font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md"
              style={{ background: `${cfg.cor}22`, color: cfg.cor }}
            >
              {cfg.label}
            </span>
            <h2 className="font-heading font-extrabold text-3xl leading-tight tracking-tight text-texto group-hover:text-verde transition-colors">
              {post.title}
            </h2>
            <p className="font-body text-muted text-base leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted font-body">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingTime} de leitura</span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-verde/40 transition-colors">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex flex-col flex-1 gap-3 p-5">
          <span
            className="inline-block w-fit text-xs font-heading font-bold uppercase tracking-widest px-2 py-1 rounded"
            style={{ background: `${cfg.cor}22`, color: cfg.cor }}
          >
            {cfg.label}
          </span>
          <h3 className="font-heading font-bold text-lg leading-snug tracking-tight text-texto group-hover:text-verde transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="font-body text-sm text-muted leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted font-body pt-2 border-t border-border">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
