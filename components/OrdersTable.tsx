//components/OrdersTable.tsx
'use client'

import useSWR from 'swr'
import toast from 'react-hot-toast'
import { useMemo, useState } from 'react'
import { currency } from '@/lib/utils'

type LineItem = { id: string; name: string; price: number; quantity: number }

type Order = {
  orderId: string
  customerId?: string | null
  customerName: string
  customerPhone: string
  customerAddress: string
  items: LineItem[]
  subtotal: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string // ISO string
}

const fetcher = (u: string) => fetch(u, { cache: 'no-store' }).then(r => r.json())

function normalize(o: any): Order {
  // Accept both camelCase and snake_case from API
  return {
    orderId: o.orderId ?? o.order_id,
    customerId: o.customerId ?? o.customer_id ?? null,
    customerName: o.customerName ?? o.customer_name ?? '',
    customerPhone: o.customerPhone ?? o.customer_phone ?? '',
    customerAddress: o.customerAddress ?? o.customer_address ?? '',
    items: o.items ?? [],
    subtotal: o.subtotal ?? 0,
    total: o.total ?? 0,
    status: o.status,
    createdAt: o.createdAt ?? o.created_at,
  }
}

export function OrdersTable() {
  const { data, mutate, isLoading, error } = useSWR<Order[]>('/api/orders', fetcher)
  const [viewing, setViewing] = useState<Order | null>(null)
  const [changing, setChanging] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const orders = useMemo(() => (data ?? []).map(normalize), [data])

  async function updateStatus(orderId: string, status: Order['status']) {
    setChanging(orderId)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Status updated')
      mutate()
    } catch {
      toast.error('Update failed')
    } finally {
      setChanging(null)
    }
  }

  async function remove(orderId: string) {
    if (!confirm(`Delete order #${orderId}? This cannot be undone.`)) return
    setRemoving(orderId)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Order deleted')
      mutate()
    } catch {
      toast.error('Delete failed')
    } finally {
      setRemoving(null)
    }
  }

  if (error) return <div className="card p-4">Failed to load orders.</div>

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Orders</h2>
        <div className="text-sm text-white/60">{isLoading ? 'Loading…' : `${orders.length} order(s)`}</div>
      </div>

      {orders.length === 0 ? (
        <div className="text-white/70">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/70">
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-3">Order</th>
                <th className="text-left py-2 pr-3">Customer</th>
                <th className="text-left py-2 pr-3">Total</th>
                <th className="text-left py-2 pr-3">Status</th>
                <th className="text-left py-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId} className="border-b border-white/10 align-top">
                  <td className="py-3 pr-3">
                    <div className="text-sm text-white/70">
                      <span className="text-white/90 font-mono">#{o.orderId}</span>
                      <span className="ml-2">• {new Date(o.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-white/60">{o.items.length} item(s)</div>
                  </td>

                  <td className="py-3 pr-3">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-white/60">{o.customerPhone}</div>
                    <div className="text-white/60 line-clamp-1 max-w-xs">{o.customerAddress}</div>
                  </td>

                  <td className="py-3 pr-3 font-mono">{currency(o.total)}</td>

                  <td className="py-3 pr-3">
                    <select
                      className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"
                      value={o.status}
                      onChange={e => updateStatus(o.orderId, e.target.value as Order['status'])}
                      disabled={changing === o.orderId}
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>

                  <td className="py-3 pr-3">
                    <div className="flex gap-2">
                      <button className="btn btn-ghost" onClick={() => setViewing(o)}>View</button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => remove(o.orderId)}
                        disabled={removing === o.orderId}
                      >
                        {removing === o.orderId ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: order details */}
      {viewing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3">
          <div className="card w-[min(720px,96vw)] p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/70">
                  <span className="text-white/90 font-mono">#{viewing.orderId}</span>
                  <span className="ml-2">• {new Date(viewing.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-white/80">{viewing.customerName} — {viewing.customerPhone}</div>
                <div className="text-white/60">{viewing.customerAddress}</div>
              </div>
              <button className="btn btn-ghost" onClick={() => setViewing(null)}>Close</button>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="text-left p-2">Item</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Line</th>
                  </tr>
                </thead>
                <tbody>
                  {viewing.items.map((it, idx) => (
                    <tr key={idx} className="border-t border-white/10">
                      <td className="p-2">{it.name}</td>
                      <td className="p-2">{it.quantity}</td>
                      <td className="p-2 font-mono">{currency(it.price)}</td>
                      <td className="p-2 font-mono">{currency(it.price * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-6 text-sm">
              <div>Subtotal: <span className="font-mono">{currency(viewing.subtotal)}</span></div>
              <div>Total: <span className="font-mono">{currency(viewing.total)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
