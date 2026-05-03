# Futebolia — IA + Copa do Mundo 2026

> Portal de conteúdo autônomo sobre Inteligência Artificial aplicada ao futebol, apostas esportivas e turismo na Copa do Mundo 2026.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-black?logo=vercel)](https://vercel.com)

---

## Sobre o Projeto

O **Futebolia** é um portal de conteúdo 100% autônomo — pesquisa tendências, escreve artigos, gera imagens, publica no site e distribui nas redes sociais sem intervenção manual.

O sistema é movido por **8 agentes de IA especializados** que trabalham em conjunto, cobrindo três nichos estratégicos com alto potencial de monetização na Copa 2026:

| Nicho | Conteúdo | Monetização |
|-------|---------|-------------|
| **iGaming** | Micro-mercados, player props, odds ao vivo | RevShare (Bet365, KTO, Betano) |
| **Turismo Inteligente** | Cidades-sede, hotéis com IA, guias de viagem | Afiliados (Booking, Decolar) |
| **PMEs** | Ferramentas de IA para pequenos negócios | SaaS (Photoroom, Canva, CapCut) |

---

## Arquitetura dos Agentes

```
Researcher      — Gemini 2.5 Flash   — Pesquisa tendências via Google Search
     ↓
Orchestrator    — Gemini 2.5 Pro     — Valida pauta e coordena pipeline
     ↓
Copywriter      — Claude Sonnet 4.6  — Redação SEO/AEO
     ↓
Visual          — Gemini 2.0 Flash   — Thumbnails, posts, carrosséis
     ↓
Growth          — Claude Sonnet 4.6  — CTAs, afiliados, monetização
     ↓
Publisher       — Gemini 2.0 Flash   — Publica via GitHub API
     ↓
Distributor     — Gemini 2.0 Flash   — Twitter/X, Instagram, Threads
     ↓
Monitor         — Gemini 2.0 Flash   — Relatório diário via Telegram
```

---

## Stack Técnica

### Frontend
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Estilização:** Tailwind CSS v3
- **Fontes:** Plus Jakarta Sans + Inter (Google Fonts)
- **Hospedagem:** Vercel (free tier)

### Conteúdo
- **Formato:** Markdown com frontmatter YAML
- **Renderização:** remark + rehype
- **Armazenamento:** arquivos `.md` em `content/posts/`

### Geração de Imagens
- **Thumbnails de artigo:** Gemini Imagen 3
- **Stories e Reels:** FLUX.1 Schnell (fal.ai)
- **Posts com texto:** Ideogram
- **Carrosséis e banners:** Puppeteer + HTML/CSS templates

### Automação
- **Agendamento:** Vercel Cron Jobs (diário)
- **Publicação:** GitHub API → commit → Vercel auto-deploy
- **Notificações:** Telegram Bot API
- **Rastreamento de cliques:** endpoint interno `/api/click`

---

## Estrutura do Projeto

```
site/
├── app/                        # Páginas e rotas Next.js
│   ├── page.tsx                # Homepage
│   ├── [slug]/page.tsx         # Página de artigo
│   ├── categoria/[c]/page.tsx  # Página por categoria
│   ├── politica-de-privacidade/# Política LGPD
│   ├── disclaimer/             # Termos e aviso de apostas
│   └── api/
│       ├── publish/            # Endpoint do Publisher Agent
│       ├── click/              # Rastreamento de afiliados
│       └── cron/report/        # Relatório diário automático
├── components/                 # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ArticleCard.tsx
│   ├── CookieBanner.tsx        # Consentimento LGPD
│   ├── GamblingNotice.tsx      # Aviso jogo responsável
│   └── AffiliateDisclaimer.tsx # Disclaimer de afiliados
├── lib/
│   ├── posts.ts                # Leitura e parse dos artigos
│   ├── telegram.ts             # Envio de notificações
│   └── analytics.ts            # Métricas e saúde do sistema
├── content/posts/              # Artigos em Markdown
└── assets/templates/           # Templates HTML para imagens
    ├── ig-feed.html
    ├── carousel.html
    ├── twitter-banner.html
    ├── stories.html
    └── render.js               # Renderer Puppeteer
```

---

## Conformidade Legal

O Futebolia opera em conformidade com:

- **Lei 14.790/2023** — regulamentação de apostas esportivas no Brasil
- **LGPD (Lei 13.709/2018)** — proteção de dados pessoais
- **CONAR** — diretrizes de publicidade e afiliados
- **CDC** — Código de Defesa do Consumidor

Todo conteúdo de iGaming inclui avisos obrigatórios de jogo responsável. Apenas casas de apostas licenciadas pelo Ministério da Fazenda são divulgadas.

---

## Rodando Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em http://localhost:3000
```

### Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```env
PUBLISH_SECRET=          # Protege endpoint de publicação
TELEGRAM_BOT_TOKEN=      # Token do bot @BotFather
TELEGRAM_CHAT_ID=        # ID do chat para notificações
CRON_SECRET=             # Autenticação do cron job
GITHUB_TOKEN=            # Para o Publisher Agent
```

---

## Calendário Editorial

| Dia | Nicho | Formato |
|-----|-------|---------|
| Segunda | iGaming | Análise de odds + micro-mercados |
| Quarta | Turismo Inteligente | Guia de destinos + ferramentas |
| Sexta | PMEs | Tutorial de ferramenta de IA |
| Sábado | Viral / Copa ao Vivo | Threads + Reels |

---

## Site

[futebolia.com.br](https://futebolia.com.br)
