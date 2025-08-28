import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(req: NextRequest){
  const rows = await sql`select * from orders order by created_at desc` as any
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest){
  const o = await req.json()
  await sql`insert into orders (order_id, customer_id, customer_name, customer_phone, customer_address, items, subtotal, total, status)
            values (${o.orderId}, ${o.customerId}, ${o.customerName}, ${o.customerPhone}, ${o.customerAddress}, ${JSON.stringify(o.items)}, ${o.subtotal}, ${o.total}, ${o.status ?? 'pending'})`;
  return NextResponse.json({ ok: true })
}