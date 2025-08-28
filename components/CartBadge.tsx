'use client'
import Link from 'next/link'
import { useCart } from '@/lib/cart'

export function CartBadge(){
  const { items } = useCart()
  const count = items.reduce((s, i)=> s + i.quantity, 0)
  return (
    <Link href="/cart" className="relative btn btn-ghost">
      Cart
      {!!count && <span className="absolute -top-2 -right-2 badge">{count}</span>}
    </Link>
  )
}