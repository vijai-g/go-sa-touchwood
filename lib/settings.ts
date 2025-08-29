import { sql } from '@/lib/db'

export type HomeSettings = {
  title: string
  description: string
  hero: string
  kind: 'public' | 'data' | 'url'
}

export async function getHomeSettings(): Promise<HomeSettings> {
  const rows = await sql`select value from site_settings where key='home' limit 1` as any
  const v = rows?.[0]?.value ?? {}
  return {
    title: v.title ?? 'Go Sa Touchwood',
    description: v.description ?? 'Minimal, durable wood essentials. Built for homes that love calm aesthetics.',
    hero: v.hero ?? '/images/GoSaHero.png',
    kind: v.kind ?? 'public'
  }
}
