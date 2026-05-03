import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        verde:   '#00A859',
        azul:    '#0066FF',
        dourado: '#FFD700',
        vermelho:'#FF4444',
        fundo:   '#0A0A0A',
        texto:   '#F5F5F5',
        muted:   'rgba(245,245,245,0.5)',
        card:    '#111111',
        border:  'rgba(245,245,245,0.08)',
      },
      fontFamily: {
        heading: ['var(--font-jakarta)', 'sans-serif'],
        body:    ['var(--font-inter)',   'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F5F5F5',
            a: { color: '#00A859', '&:hover': { color: '#0066FF' } },
            h1: { color: '#F5F5F5', fontFamily: 'var(--font-jakarta)' },
            h2: { color: '#F5F5F5', fontFamily: 'var(--font-jakarta)' },
            h3: { color: '#F5F5F5', fontFamily: 'var(--font-jakarta)' },
            strong: { color: '#F5F5F5' },
            blockquote: { borderLeftColor: '#00A859', color: 'rgba(245,245,245,0.7)' },
            code: { color: '#00A859', background: 'rgba(0,168,89,0.1)', padding: '2px 6px', borderRadius: '4px' },
            'code::before': { content: '""' },
            'code::after':  { content: '""' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
