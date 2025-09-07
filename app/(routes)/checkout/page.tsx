'use client'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'
import { useCallback, useMemo, useState } from 'react'

function makeOrderCode(): string {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const ms = String(d.getTime()).slice(-5) // improves uniqueness
  const rnd = Math.floor(Math.random() * 1_000).toString().padStart(3, '0')
  return `WT-${yy}${mm}${dd}-${ms}${rnd}`
}

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const [submitting, setSubmitting] = useState(false)

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [items]
  )

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    if (!items.length) return alert('Cart is empty')

    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const address = String(fd.get('address') || '').trim()
    if (!name || !phone || !address) return alert('Name, phone, and address are required.')

    const clientOrderId = makeOrderCode()

    const order = {
      orderId: clientOrderId,
      customerId: 'guest',
      name, phone, address,
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
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
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(order)
      })
      const data = await res.json().catch(() => ({} as any))
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || `Order failed (${res.status})`)
      }

      const finalOrderId = data?.orderId || clientOrderId
      try { localStorage.setItem('lastOrderId', finalOrderId) } catch {}

      clear()
      window.location.href = `/success?order=${encodeURIComponent(finalOrderId)}`
    } catch (err: any) {
      alert(err?.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }, [items, subtotal, submitting, clear])

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-[1.2fr,0.8fr] items-start">
      {/* Left card */}
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Delivery details</h2>

        <div className="flex flex-col gap-4">
          <input
            required
            name="name"
            placeholder="Your name"
            autoComplete="name"
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-card border border-gray-300 text-primary
                       placeholder:text-primary/50 outline-none
                       focus:border-forest focus:ring-2 focus:ring-forest/40"
          />

          <input
            required
            name="phone"
            placeholder="Phone"
            inputMode="tel"
            autoComplete="tel"
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-card border border-gray-300 text-primary
                       placeholder:text-primary/50 outline-none
                       focus:border-forest focus:ring-2 focus:ring-forest/40"
          />

          <textarea
            required
            name="address"
            placeholder="Address"
            autoComplete="street-address"
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-card border border-gray-300 text-primary
                       placeholder:text-primary/50 outline-none min-h-28
                       focus:border-forest focus:ring-2 focus:ring-forest/40"
          />
        </div>
      </div>

      {/* Right card */}
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Order summary</h2>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <strong>{currency(subtotal)}</strong>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? 'Placing…' : 'Place order (COD/UPI)'}
        </button>

        <p className="text-xs text-primary/70">
          You will receive a WhatsApp message to confirm UPI/COD.
        </p>
      </div>
    </form>
  )
}
