'use client'

import Link from 'next/link'
import { useState } from 'react'

const categorias = [
  { label: 'iGaming',  href: '/categoria/igaming',  cor: 'text-verde' },
  { label: 'Turismo',  href: '/categoria/turismo',  cor: 'text-azul'  },
  { label: 'PMEs',     href: '/categoria/pmes',     cor: 'text-dourado'},
  { label: 'Ao Vivo',  href: '/categoria/viral',    cor: 'text-vermelho'},
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-fundo/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-heading font-extrabold text-2xl tracking-tight">
          futebol<span className="text-verde">ia</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {categorias.map(c => (
            <Link
              key={c.href}
              href={c.href}
              className={`font-body text-sm font-medium ${c.cor} hover:opacity-80 transition-opacity`}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop */}
        <Link
          href="/categoria/igaming"
          className="hidden md:inline-flex items-center gap-2 bg-verde text-fundo font-heading font-bold text-sm px-4 py-2 rounded-lg hover:bg-verde/90 transition-colors"
        >
          Apostas Copa 2026
        </Link>

        {/* Menu mobile */}
        <button
          className="md:hidden text-texto"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Nav mobile */}
      {open && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-4">
          {categorias.map(c => (
            <Link
              key={c.href}
              href={c.href}
              onClick={() => setOpen(false)}
              className={`font-body font-medium ${c.cor}`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
