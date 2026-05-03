'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-body text-sm text-muted leading-relaxed max-w-2xl">
          Usamos cookies para analytics e funcionamento do site, conforme nossa{' '}
          <Link href="/politica-de-privacidade" className="text-verde underline underline-offset-2">
            Política de Privacidade
          </Link>
          . Nenhum dado pessoal é coletado.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="font-body text-sm text-muted hover:text-texto transition-colors px-4 py-2"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="font-heading font-bold text-sm bg-verde text-fundo px-5 py-2 rounded-lg hover:bg-verde/90 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  )
}
