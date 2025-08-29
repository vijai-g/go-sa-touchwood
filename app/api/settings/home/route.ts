import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { z } from 'zod'

const HomeSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(400),
  hero: z.string().min(1),
  kind: z.enum(['public', 'data', 'url']),
})

export async function GET() {
  const rows = (await sql`select value from site_settings where key='home' limit 1`) as any
  let value = rows?.[0]?.value ?? null
  // Neon can return jsonb as object or as text depending on client mapping
  if (typeof value === 'string') {
    try { value = JSON.parse(value) } catch {}
  }
  return NextResponse.json(value)
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}))
  const parsed = HomeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 })
  }

  const v = parsed.data
  const payload = JSON.stringify(v) // <- serialize and cast to jsonb in SQL

  await sql`
    insert into site_settings (key, value)
    values ('home', ${payload}::jsonb)
    on conflict (key) do update
    set value = ${payload}::jsonb,
        updated_at = now()
  `
  return NextResponse.json({ ok: true })
}
