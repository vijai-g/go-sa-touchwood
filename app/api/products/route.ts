import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(){
  const rows = await sql`select id,name,description,price,image,category,tags,available from products order by name` as any
  return NextResponse.json(rows)
}

export async function POST(req: Request){
  const p = await req.json()
  await sql`insert into products (id,name,description,price,image,category,tags,available)
            values (${p.id}, ${p.name}, ${p.description}, ${p.price}, ${p.image}, ${p.category}, ${p.tags}, ${p.available})
            on conflict (id) do update set
              name=excluded.name, description=excluded.description, price=excluded.price,
              image=excluded.image, category=excluded.category, tags=excluded.tags, available=excluded.available`;
  return NextResponse.json({ ok: true })
}