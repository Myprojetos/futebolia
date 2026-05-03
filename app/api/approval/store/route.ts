import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// In-memory store (persists within the same serverless instance)
// For production scale, replace with Vercel KV or Upstash Redis
export const approvalStore = new Map<string, {
  type: string
  payload: Record<string, unknown>
  createdAt: number
}>()

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token, type, payload } = await req.json()
  if (!token || !payload) return NextResponse.json({ error: 'token e payload obrigatórios' }, { status: 400 })

  approvalStore.set(token, { type, payload, createdAt: Date.now() })

  // Auto-expire after 24h
  setTimeout(() => approvalStore.delete(token), 24 * 60 * 60 * 1000)

  return NextResponse.json({ ok: true, token })
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token obrigatório' }, { status: 400 })

  const entry = approvalStore.get(token)
  if (!entry) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json({ ok: true, ...entry })
}
