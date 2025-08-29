'use client'
import useSWR from 'swr'
import { Order } from '@/lib/types'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function MyOrders(){
  const { data } = useSWR<Order[]>('/api/orders?mine=1', fetcher)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {(data ?? []).map(o => (
// app/(routes)/myorders/page.tsx (inside the map of orders)
<div key={o.orderId} className="card p-4 space-y-2">
  <div className="flex items-center justify-between">
    <div className="font-semibold">{o.items.length} item(s)</div>
    <div className="font-mono">₹{o.total}</div>
  </div>

  <div className="text-sm text-white/70">
    <span className="text-white/90 font-mono">#{o.orderId}</span>
    <span className="ml-2">• {new Date(o.createdAt).toLocaleString()}</span>
  </div>
</div>

      ))}
    </div>
  )
}
