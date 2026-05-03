import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  const data = await res.json()
  return NextResponse.json(data)
}
