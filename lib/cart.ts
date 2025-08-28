'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from './types'

interface CartState {
  items: CartItem[]
  add: (p: Product, q?: number) => void
  remove: (id: string) => void
  setQty: (id: string, q: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(persist((set, get) => ({
  items: [],
  add: (p, q = 1) => {
    const items = structuredClone(get().items)
    const idx = items.findIndex(i => i.product.id === p.id)
    if (idx >= 0) items[idx].quantity += q; else items.push({ product: p, quantity: q })
    set({ items })
  },
  remove: (id) => set({ items: get().items.filter(i => i.product.id !== id) }),
  setQty: (id, q) => set({ items: get().items.map(i => i.product.id === id ? { ...i, quantity: Math.max(1, q) } : i) }),
  clear: () => set({ items: [] })
}), { name: 'gstw-cart' }))