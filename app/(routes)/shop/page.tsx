'use client'
import useSWR from 'swr'
import { Product } from '@/lib/types'
import { ProductCard } from '@/components/ProductCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { useState, useMemo } from 'react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ShopPage() {
  const { data } = useSWR<Product[]>('/api/products', fetcher)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => (data ?? [])
    .filter(p => (cat === 'all' ? true : p.category === cat))
    .filter(p => (q ? (p.name + " " + p.description).toLowerCase().includes(q.toLowerCase()) : true)), [data, q, cat])

  const cats = useMemo(() => ['all', ...Array.from(new Set((data ?? []).map(p => p.category)))], [data])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search…"
          className="px-4 py-2 rounded-xl bg-black/5 border border-black/10 focus:border-forest focus:ring-1 focus:ring-forest"
        />
        <CategoryFilter categories={cats} value={cat} onChange={setCat} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}