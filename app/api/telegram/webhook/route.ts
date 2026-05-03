import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Pending approvals stored in memory (use KV/Redis in production for persistence)
// Format: { [token]: { type, payload, createdAt } }
const pendingApprovals = new Map<string, {
  type: 'article' | 'post' | 'short' | 'tiktok'
  payload: Record<string, unknown>
  createdAt: number
}>()

export function addPendingApproval(token: string, type: 'article' | 'post' | 'short' | 'tiktok', payload: Record<string, unknown>) {
  pendingApprovals.set(token, { type, payload, createdAt: Date.now() })
}

export async function POST(req: NextRequest) {
  let body: {
    callback_query?: {
      id: string
      data: string
      from: { id: number }
      message: { chat: { id: number }; message_id: number }
    }
    message?: {
      text: string
      chat: { id: number }
    }
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN!
  const ownerId  = Number(process.env.TELEGRAM_CHAT_ID!)

  // Handle inline button callback
  if (body.callback_query) {
    const { id: callbackId, data, from, message } = body.callback_query

    // Only process from owner
    if (from.id !== ownerId) {
      await answerCallback(botToken, callbackId, '❌ Não autorizado')
      return NextResponse.json({ ok: true })
    }

    const [action, token] = data.split(':')
    const pending = pendingApprovals.get(token)

    if (!pending) {
      await answerCallback(botToken, callbackId, '⚠️ Aprovação expirada ou não encontrada')
      return NextResponse.json({ ok: true })
    }

    pendingApprovals.delete(token)

    if (action === 'approve') {
      await answerCallback(botToken, callbackId, '✅ Aprovado! Publicando...')
      await editMessage(botToken, message.chat.id, message.message_id, '✅ *Aprovado — publicando agora...*')

      // Trigger publish
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
      try {
        const publishRes = await fetch(`${baseUrl}/api/publish`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PUBLISH_SECRET}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pending.payload),
        })
        const result = await publishRes.json()

        if (result.ok) {
          await sendMessage(botToken, ownerId, `✅ *Publicado com sucesso!*\n\n🔗 ${result.url}`)
        } else {
          await sendMessage(botToken, ownerId, `⚠️ *Erro ao publicar:* ${result.error}`)
        }
      } catch (err) {
        await sendMessage(botToken, ownerId, `⚠️ *Erro inesperado:* ${err}`)
      }
    } else if (action === 'reject') {
      await answerCallback(botToken, callbackId, '❌ Rejeitado')
      await editMessage(botToken, message.chat.id, message.message_id, '❌ *Conteúdo rejeitado — salvo em rascunhos*')
      await sendMessage(botToken, ownerId, '📁 Conteúdo salvo em rascunhos. Responda com o motivo da rejeição para o agente aprender (opcional).')
    }
  }

  return NextResponse.json({ ok: true })
}

// ─── Telegram helpers ─────────────────────────────────────────────────────────

async function sendMessage(token: string, chatId: number, text: string, replyMarkup?: object) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  })
}

async function answerCallback(token: string, callbackId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackId, text }),
  })
}

async function editMessage(token: string, chatId: number, messageId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: 'Markdown' }),
  })
}

export { sendMessage as sendApprovalRequest }
