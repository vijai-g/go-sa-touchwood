// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function makeOrderCode() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  const rnd = Math.floor(Math.random()*1_000_000).toString().padStart(6,'0')
  return `GOSA-${yy}${mm}${dd}-${rnd}`
}

// POST /api/orders  -> create order
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ ok:false, error:'Bad JSON' }, { status:400 })

  // normalize both shapes coming from client
  const name    = (body.name ?? body.customerName ?? '').trim()
  const phone   = (body.phone ?? body.customerPhone ?? '').trim()
  const address = (body.address ?? body.customerAddress ?? '').trim()
  const deliverySlot = (body.deliverySlot ?? null) || null
  const items   = Array.isArray(body.items) ? body.items : []
  const subtotal = Number(body.subtotal ?? 0)
  const total    = Number(body.total ?? 0)
  const status   = (body.status ?? 'pending') as string
  const customerId = body.customerId ?? null

  if (!name || !phone || !address || !items.length) {
    return NextResponse.json({ ok:false, error:'Missing fields' }, { status:400 })
  }

  const session = await auth()
  const customerEmail = session?.user?.email ?? body.customerEmail ?? null

  const orderId = String(body.orderId || makeOrderCode())
  const itemsJson = JSON.stringify(items)

  // insert; cast items to jsonb (Neon-safe)
  const rows = await sql/*sql*/`
    insert into orders
      (order_id, customer_id, customer_email, customer_name, customer_phone, customer_address,
       items, subtotal, total, status, created_at, delivery_slot)
    values
      (${orderId}, ${customerId}, ${customerEmail}, ${name}, ${phone}, ${address},
       ${itemsJson}::jsonb, ${subtotal}, ${total}, ${status}, now(), ${deliverySlot})
    on conflict (order_id) do nothing
    returning order_id
  ` as any

  const finalId = rows?.[0]?.order_id || orderId
  return NextResponse.json({ ok:true, orderId: finalId })
}

// GET /api/orders  -> list orders (admin only; used by Admin OrdersTable)
export async function GET() {
  const session = await auth()
  if (!session || (session as any).role !== 'admin') {
    return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 })
  }

  const rows = await sql/*sql*/`
    select
      order_id         as "orderId",
      customer_id      as "customerId",
      customer_email   as "customerEmail",
      customer_name    as "customerName",
      customer_phone   as "customerPhone",
      customer_address as "customerAddress",
      items,
      subtotal,
      total,
      status,
      created_at       as "createdAt",
      delivery_slot    as "deliverySlot"
    from orders
    order by created_at desc
  ` as any

  return NextResponse.json(rows ?? [])
}
