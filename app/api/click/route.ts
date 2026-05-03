import { NextRequest, NextResponse } from 'next/server'
import { trackClick } from '@/lib/analytics'

export async function POST(req: NextRequest) {
  const { slug } = await req.json()
  if (!slug) return NextResponse.json({ error: 'slug obrigatório' }, { status: 400 })
  trackClick(slug)
  return NextResponse.json({ ok: true })
}
