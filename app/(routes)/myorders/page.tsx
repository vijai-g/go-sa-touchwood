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
        <div key={o.orderId} className="card p-4">
          <div className="flex justify-between">
            <div>
              <div className="text-white/80">Order {o.orderId}</div>
              <div className="badge">{o.status}</div>
            </div>
            <div>{new Date(o.createdAt || Date.now()).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  )
}