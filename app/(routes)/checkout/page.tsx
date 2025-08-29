'use client'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'
import { useState } from 'react'

function makeOrderCode(): string {
  // e.g. GOSA-250829-123456
  const d = new Date()
  const yy = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const rnd = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0')
  return `GOSA-${yy}${mm}${dd}-${rnd}`
}

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const [submitting, setSubmitting] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  async function placeOrder(formData: FormData) {
    if (!items.length) return alert('Cart is empty')

    const name = String(formData.get('name') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const address = String(formData.get('address') || '').trim()
    const deliverySlot = String(formData.get('deliverySlot') || '').trim()

    if (!name || !phone || !address) return alert('Name, phone, and address are required.')

    const clientOrderId = makeOrderCode() // friendly fallback; server may return its own

    const order = {
      orderId: clientOrderId,         // client-generated; server should still generate/validate its own
      customerId: 'guest',            // replace with session user id when auth-enforced
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      deliverySlot: deliverySlot || null,
      items: items.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity
      })),
      subtotal,
      total: subtotal,
      status: 'pending'
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(order)
      })

      const data = await res.json().catch(() => ({} as any))
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || 'Failed to place order')
      }

      const finalOrderId = data?.orderId || clientOrderId
      // keep it around for the success page if you want to read it there
      try { localStorage.setItem('lastOrderId', finalOrderId) } catch {}

      clear()
      window.location.href = `/success?order=${encodeURIComponent(finalOrderId)}`
    } catch (e: any) {
      alert(e?.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form action={placeOrder} className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Delivery details</h2>
        <input required name="name" placeholder="Your name" className="px-4 py-3 rounded-xl bg-white/10" />
        <input required name="phone" placeholder="Phone" className="px-4 py-3 rounded-xl bg-white/10" />
        <textarea required name="address" placeholder="Address" className="px-4 py-3 rounded-xl bg-white/10 min-h-28" />
        <input name="deliverySlot" placeholder="Preferred delivery slot (optional)" className="px-4 py-3 rounded-xl bg-white/10" />
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <strong>{currency(subtotal)}</strong>
        </div>
        <button className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? 'Placing…' : 'Place order (COD/UPI)'}
        </button>
        <p className="text-xs text-white/60">You will receive a WhatsApp message to confirm UPI/COD.</p>
      </div>
    </form>
  )
}
