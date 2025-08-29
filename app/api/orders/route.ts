import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function makeOrderCode() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)   // YY
  const m = String(d.getMonth()+1).padStart(2,'0')
  const day = String(d.getDate()).padStart(2,'0')
  const rnd = Math.floor(Math.random()*1_000_000).toString().padStart(6,'0')
  return `GOSA-${y}${m}${day}-${rnd}`
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null)
  if (!body) return NextResponse.json({ ok:false, error:'Bad JSON' }, { status:400 })

  // validate minimal fields
  const { name, phone, address, deliverySlot, items, subtotal, total } = body
  if (!name || !phone || !address || !Array.isArray(items)) {
    return NextResponse.json({ ok:false, error:'Missing fields' }, { status:400 })
  }

  const orderId = makeOrderCode()

  // If you have user info in session, use it; otherwise set to null/guest
  // Example assumes you store JSONB "items"
  const itemsJson = JSON.stringify(items)

  const rows = await sql/*sql*/`
    insert into orders
      (order_id, customer_name, customer_phone, customer_address, items, subtotal, total, status, created_at)
    values
      (${orderId}, ${name}, ${phone}, ${address}, ${itemsJson}::jsonb, ${subtotal}, ${total}, 'pending', now())
    returning order_id
  ` as any

  return NextResponse.json({ ok:true, orderId: rows?.[0]?.order_id ?? orderId })
}
