import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ThemeSchema = z.object({
  primary:  z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
  secondary:z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
  accent:   z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
  body:     z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
  card:     z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
})

export async function GET() {
  const rows = (await sql`select value from site_settings where key='theme' limit 1`) as any
  let value = rows?.[0]?.value ?? null
  if (typeof value === 'string') { try { value = JSON.parse(value) } catch {} }
  return NextResponse.json(value)
}

async function upsert(v: unknown) {
  const parsed = ThemeSchema.safeParse(v)
  if (!parsed.success) return NextResponse.json({ ok:false, error:'Invalid input' }, { status:400 })
  const payload = JSON.stringify(parsed.data)
  await sql`
    insert into site_settings (key, value)
    values ('theme', ${payload}::jsonb)
    on conflict (key) do update set value=${payload}::jsonb, updated_at=now()
  `
  return NextResponse.json({ ok:true })
}

export async function POST(req: Request) { const body = await req.json().catch(()=>({})); return upsert(body) }
export async function PUT(req: Request)  { const body = await req.json().catch(()=>({})); return upsert(body) }
