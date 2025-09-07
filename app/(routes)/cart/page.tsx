'use client'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'
import Link from 'next/link'

export default function CartPage(){
  const { items, setQty, remove } = useCart()
  const subtotal = items.reduce((s, i)=> s + i.product.price * i.quantity, 0)

  if (!items.length) return (
    <div className="text-center space-y-4">
      <p className="text-white/80">Your cart is empty.</p>
      <Link href="/shop" className="btn btn-primary">Browse products</Link>
    </div>
  )

  return (
    <div className="space-y-6">
      {items.map(({ product, quantity }) => (
        <div key={product.id} className="card p-4 flex items-center gap-4">
          <div className="min-w-24 h-24 rounded-xl overflow-hidden bg-white/5">
            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-black/70">{currency(product.price)}</p>
          </div>
          <input type="number" min={1} value={quantity} onChange={e=>setQty(product.id, Number(e.target.value)||1)} className="w-20 px-3 py-2 rounded-lg bg-white/10" />
          <button onClick={()=>remove(product.id)} className="btn btn-ghost">Remove</button>
        </div>
      ))}
      <div className="flex items-center justify-between card p-4">
        <strong>Subtotal</strong>
        <strong>{currency(subtotal)}</strong>
      </div>
      <div className="text-right">
        <Link href="/checkout" className="btn btn-primary">Checkout</Link>
      </div>
    </div>
  )
}