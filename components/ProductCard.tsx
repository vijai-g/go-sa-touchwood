'use client'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }){
  const { add } = useCart()
  return (
    <div className="card p-4 flex flex-col">
      <img src={product.image} alt={product.name} className="rounded-xl h-48 w-full object-cover" />
      <div className="mt-3 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="badge">{product.category}</span>
        </div>
        <p className="text-white/70 text-sm line-clamp-2 mt-1">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <strong>{currency(product.price)}</strong>
        <button onClick={()=>add(product,1)} className="btn btn-primary">Add to cart</button>
      </div>
    </div>
  )
}