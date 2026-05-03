import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-extrabold text-xl">
              futebo<span className="text-verde">lia</span>
            </span>
            <p className="font-body text-sm text-muted leading-relaxed">
              Inteligência Artificial aplicada à Copa do Mundo 2026.
              Apostas, turismo e ferramentas para PMEs.
            </p>
          </div>

          {/* Categorias */}
          <div className="flex flex-col gap-2">
            <span className="font-heading font-bold text-sm uppercase tracking-widest text-muted mb-1">
              Categorias
            </span>
            {[
              { label: 'iGaming',       href: '/categoria/igaming'  },
              { label: 'Turismo',       href: '/categoria/turismo'  },
              { label: 'PMEs',          href: '/categoria/pmes'     },
              { label: 'Copa ao Vivo',  href: '/categoria/viral'    },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-sm text-muted hover:text-verde transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <span className="font-heading font-bold text-sm uppercase tracking-widest text-muted mb-1">
              Legal
            </span>
            <p className="font-body text-xs text-muted leading-relaxed">
              Este site contém links de afiliados. Podemos receber comissão
              por compras realizadas através desses links, sem custo adicional
              para você.
            </p>
            <p className="font-body text-xs text-muted leading-relaxed">
              Apostas esportivas envolvem risco. Jogue com responsabilidade.
              Proibido para menores de 18 anos.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted font-body">
          <span>© {new Date().getFullYear()} Futebolia. Todos os direitos reservados.</span>
          <span>futebolia.com.br</span>
        </div>
      </div>
    </footer>
  )
}
