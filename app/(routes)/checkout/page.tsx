'use client'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'

export default function CheckoutPage(){
  const { items, clear } = useCart()

  async function placeOrder(formData: FormData){
    if (!items.length) return alert('Cart is empty')
    const order = {
      orderId: crypto.randomUUID(),
      customerId: 'guest',
      customerName: String(formData.get('name')||''),
      customerPhone: String(formData.get('phone')||''),
      customerAddress: String(formData.get('address')||''),
      items: items.map(i=>({ id:i.product.id, name:i.product.name, price:i.product.price, quantity:i.quantity })),
      subtotal: items.reduce((s,i)=>s+i.product.price*i.quantity,0),
      total: items.reduce((s,i)=>s+i.product.price*i.quantity,0),
      status: 'pending'
    }
    const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(order) })
    if (res.ok){
      clear()
      window.location.href = '/success'
    } else alert('Failed to place order')
  }

  const subtotal = items.reduce((s, i)=> s + i.product.price * i.quantity, 0)

  return (
    <form action={placeOrder} className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Delivery details</h2>
        <input required name="name" placeholder="Your name" className="px-4 py-3 rounded-xl bg-white/10" />
        <input required name="phone" placeholder="Phone" className="px-4 py-3 rounded-xl bg-white/10" />
        <textarea required name="address" placeholder="Address" className="px-4 py-3 rounded-xl bg-white/10 min-h-28" />
      </div>
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="flex justify-between"><span>Subtotal</span><strong>{currency(subtotal)}</strong></div>
        <button className="btn btn-primary w-full">Place order (COD/UPI)</button>
        <p className="text-xs text-white/60">You will receive a WhatsApp message to confirm UPI/COD.</p>
      </div>
    </form>
  )
}