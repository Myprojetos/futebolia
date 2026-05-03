import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Futebolia — IA + Copa do Mundo 2026',
    template: '%s | Futebolia',
  },
  description: 'Inteligência Artificial aplicada à Copa 2026: apostas, turismo e ferramentas para PMEs.',
  metadataBase: new URL('https://futebolia.com.br'),
  openGraph: {
    siteName: 'Futebolia',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@futebolia',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-fundo text-texto">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
