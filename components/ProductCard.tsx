'use client'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()

  return (
    // overflow-hidden + rounded keeps the image clipped to the card radius
    <div className="card p-0 flex flex-col overflow-hidden rounded-2xl">
      {/* Fixed aspect ratio so all cards align; Image uses fill + object-cover */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={product.image || '/images/placeholder.jpg'} // e.g. /images/chair.jpg
          alt={product.name}
          fill
          className="object-cover"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority={false}
        />
      </div>

      <div className="p-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="badge">{product.category}</span>
        </div>
        <p className="text-white/70 text-sm line-clamp-2 mt-1">{product.description}</p>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between">
        <strong>{currency(product.price)}</strong>
        <button onClick={() => add(product, 1)} className="btn btn-primary">
          Add to cart
        </button>
      </div>
    </div>
  )
}
