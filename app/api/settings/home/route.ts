import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { z } from 'zod'

const HomeSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(400),
  hero: z.string().min(1),
  kind: z.enum(['public', 'data', 'url'])
})

export async function GET() {
  const rows = await sql`select value from site_settings where key='home' limit 1` as any
  const value = rows?.[0]?.value ?? null
  return NextResponse.json(value ?? null)
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}))
  const parsed = HomeSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok:false, error:'Invalid input' }, { status:400 })

  const v = parsed.data
  await sql`
    insert into site_settings (key, value)
    values ('home', ${sql.json(v)})
    on conflict (key) do update set value = ${sql.json(v)}, updated_at = now()
  `
  return NextResponse.json({ ok: true })
}
