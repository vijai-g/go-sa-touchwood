'use client'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()

  // normalize path in case some rows missed leading slash
  const imgSrc = product.image?.startsWith('/') ? product.image : `/${product.image}`

  return (
    // Card clips everything
    <div className="card p-0 flex flex-col rounded-2xl overflow-hidden">
      {/* Image wrapper ALSO clips (belt + suspenders) */}
      <div className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden">
        <Image
          src={imgSrc || '/images/placeholder.jpg'}
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
        <button onClick={() => add(product, 1)} className="btn btn-primary">Add to cart</button>
      </div>
    </div>
  )
}
