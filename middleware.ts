import { NextRequest, NextResponse } from 'next/server'
const WINDOW_MS = 10_000
const MAX_REQ = 60
const hits = new Map<string, { count: number; ts: number }>()

export function middleware(req: NextRequest){
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const rec = hits.get(ip) || { count: 0, ts: now }
  if (now - rec.ts > WINDOW_MS) { rec.count = 0; rec.ts = now }
  rec.count++
  hits.set(ip, rec)
  if (rec.count > MAX_REQ) return new NextResponse('Too Many Requests', { status: 429 })
  return NextResponse.next()
}