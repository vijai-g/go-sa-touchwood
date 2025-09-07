'use client'

import useSWR from 'swr'
import { currency } from '@/lib/utils'

const fetcher = (u: string) => fetch(u, { cache: 'no-store' }).then(r => r.json())

export default function MyOrdersPage() {
  const { data, error, isLoading } = useSWR('/api/orders/me', fetcher)
  const orders = data ?? []

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {error && <div className="card p-4">Failed to load orders.</div>}
      {isLoading && <div className="card p-4">Loading…</div>}

      {!isLoading && !error && orders.length === 0 && (
        <div className="card p-4">No orders yet.</div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="grid gap-4">
          {orders.map((o: any) => (
            <div key={o.orderId} className="card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-black/70">
                  <span className="text-black/90 font-mono">#{o.orderId}</span>
                  <span className="ml-2">• {new Date(o.createdAt).toLocaleString()}</span>
                </div>
                <span className="badge">{o.status}</span>
              </div>
              <div className="text-black/80">
                {o.items?.length ?? 0} item(s) • <span className="font-mono">{currency(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
