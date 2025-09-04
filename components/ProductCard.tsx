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

  // normalize local file names to /images/<file>
  const src =
    isDataUrl || isHttpUrl
      ? raw
      : raw.startsWith('/images/')
      ? raw
      : raw
      ? `/images/${raw.replace(/^\/+/, '')}`
      : '/images/placeholder.jpg'

  return (
    <article className="card overflow-hidden">
      {/* fixed-height media box, no clipping */}
      <div className="relative w-full h-56 sm:h-64 bg-black/5">
        {isDataUrl || isHttpUrl ? (
          <img
            src={src}
            alt={product.name}
            className="w-full h-full object-contain object-center p-2"
            loading="lazy"
          />
        ) : (
          <Image
            src={src}
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
          <h3 className="font-semibold text-primary">{product.name}</h3>
          <span className="badge">{product.category}</span>
        </div>
        <p className="text-muted text-sm line-clamp-2 mt-1">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <strong className="text-primary">{currency(product.price)}</strong>
          <button onClick={() => add(product, 1)} className="btn btn-primary">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
