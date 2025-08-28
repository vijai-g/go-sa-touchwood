'use client'
import useSWR from 'swr'
import { Product } from '@/lib/types'
import toast from 'react-hot-toast'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export function AdminDashboard(){
  const { data, mutate } = useSWR<Product[]>('/api/products', fetcher)

  const add = async () => {
    const p: Product = { id: crypto.randomUUID(), name: 'New Item', description: 'Describe…', price: 999, image: '/images/chair.jpg', category: 'misc', tags: ['new'], available: true }
    try {
      const res = await fetch('/api/products', { method: 'POST', body: JSON.stringify(p) })
      if (!res.ok) throw new Error('write failed')
      toast.success('Added')
      mutate()
    } catch {
      toast.error('Failed to add')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <button onClick={add} className="btn btn-primary">Add product</button>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map(p => (
          <div key={p.id} className="card p-4">
            <div className="font-semibold">{p.name}</div>
            <div className="text-white/70 text-sm">₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  )
}