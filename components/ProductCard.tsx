'use client'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const src = product.image?.startsWith('/') ? product.image : `/${product.image}`

  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-lg">
      {/* FIT: fixed-height box, no clipping, full image visible */}
      <div className="relative w-full h-56 sm:h-64 bg-black/20">
        <Image
          src={src || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-contain object-center p-2"  // <= key change
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority={false}
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="badge">{product.category}</span>
        </div>
        <p className="text-white/70 text-sm line-clamp-2 mt-1">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <strong>{currency(product.price)}</strong>
          <button onClick={() => add(product, 1)} className="btn btn-primary">Add to cart</button>
        </div>
      </div>
    </div>
  )
}
