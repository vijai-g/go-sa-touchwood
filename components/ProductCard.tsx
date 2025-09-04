'use client'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()

  const raw = (product.image || '').trim()
  const isDataUrl = raw.startsWith('data:')
  const isHttpUrl = /^https?:\/\//i.test(raw)

  // Normalize local file names to /images/<file>
  const localSrc =
    isDataUrl || isHttpUrl
      ? raw
      : raw.startsWith('/images/')
      ? raw
      : raw.startsWith('/')
      ? raw
      : raw
      ? `/images/${raw}`
      : '/images/placeholder.jpg'

  return (
    <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg">


      <div className="relative w-full h-56 sm:h-64 bg-black/20">
        {isDataUrl || isHttpUrl ? (
          // Bypass next/image for data: and external URLs
          <img
            src={localSrc}
            alt={product.name}
            className="w-full h-full object-contain object-center p-2"
            loading="lazy"
          />
        ) : (
          // Use next/image for /public/images/* (optimized, cached)
          <Image
            src={localSrc}
            alt={product.name}
            fill
            className="object-contain object-center p-2"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            priority={false}
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="badge">{product.category}</span>
        </div>
        <p className="text-white/70 text-sm line-clamp-2 mt-1">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <strong>{currency(product.price)}</strong>
          <button onClick={() => add(product, 1)} className="btn btn-primary">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

