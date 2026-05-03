const TELEGRAM_API = 'https://api.telegram.org'

export async function sendTelegram(message: string): Promise<boolean> {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('Telegram não configurado — TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID ausente')
    return false
  }

  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  })

  return res.ok
}

export function buildDailyReport(data: {
  postsToday:    { title: string; categoria: string }[]
  postsWeek:     number
  postsTotal:    number
  affiliateClicks: number
  topArticle:    string
  siteOk:        boolean
  alerts:        string[]
}): string {
  const date = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })

  const lines: string[] = [
    `📊 *Relatório Futebolia*`,
    `📅 ${date}`,
    ``,
    `*Publicações:*`,
    `✅ Hoje: ${data.postsToday.length} artigo${data.postsToday.length !== 1 ? 's' : ''}`,
    `📆 Esta semana: ${data.postsWeek}`,
    `📚 Total: ${data.postsTotal}`,
  ]

  if (data.postsToday.length > 0) {
    lines.push(``)
    lines.push(`*Artigos de hoje:*`)
    data.postsToday.forEach(p => lines.push(`• ${p.title} \\[${p.categoria}\\]`))
  } else {
    lines.push(``)
    lines.push(`⚠️ Nenhum artigo publicado hoje`)
  }

  lines.push(``)
  lines.push(`*Monetização:*`)
  lines.push(`💰 Cliques em afiliados: ${data.affiliateClicks}`)
  if (data.topArticle) lines.push(`🔥 Mais clicado: ${data.topArticle}`)

  lines.push(``)
  lines.push(`*Sistema:*`)
  lines.push(data.siteOk ? `🟢 Site online` : `🔴 Site com problema`)

  if (data.alerts.length > 0) {
    lines.push(``)
    lines.push(`*⚠️ Alertas:*`)
    data.alerts.forEach(a => lines.push(`• ${a}`))
  }

  lines.push(``)
  lines.push(`🌐 https://futebolia.com.br`)

  return lines.join('\n')
}
