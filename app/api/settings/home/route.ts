import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HomeSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(400),
  hero: z.string().min(1),
  kind: z.enum(['public', 'data', 'url']),
})

export async function GET() {
  const rows = (await sql`select value from site_settings where key='home' limit 1`) as any
  let value = rows?.[0]?.value ?? null
  if (typeof value === 'string') { try { value = JSON.parse(value) } catch {} }
  return NextResponse.json(value)
}

async function upsert(body: unknown) {
  const parsed = HomeSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 })
  const payload = JSON.stringify(parsed.data)
  await sql`
    insert into site_settings (key, value)
    values ('home', ${payload}::jsonb)
    on conflict (key) do update
    set value = ${payload}::jsonb, updated_at = now()
  `
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  return upsert(body)
}

// keep PUT too (if you still call it anywhere)
export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}))
  return upsert(body)
}
