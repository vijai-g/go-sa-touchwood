import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    // not signed in => empty list (or return 401 if you prefer)
    return NextResponse.json([])
  }

  const email = session.user.email

  // Make sure your table has customer_email column (see step 3)
  const rows = await sql/*sql*/`
    select
      order_id   as "orderId",
      customer_name as "customerName",
      customer_phone as "customerPhone",
      customer_address as "customerAddress",
      items,
      subtotal,
      total,
      status,
      created_at as "createdAt"
    from orders
    where customer_email = ${email}
    order by created_at desc
  ` as any

  return NextResponse.json(rows ?? [])
}
