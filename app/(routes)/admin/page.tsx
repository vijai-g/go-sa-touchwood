import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminDashboard } from '@/components/AdminDashboard'
import { OrdersTable } from '@/components/OrdersTable'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPage() {
  const session = await auth()
  if (!session || (session as any).role !== 'admin') redirect('/')

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex gap-2">
          <Link href="/admin/appearance" className="btn btn-ghost">Appearance</Link>
          <Link href="/admin/color" className="btn btn-ghost">Colors</Link>
        </div>
      </div>

      {/* …your product manager… */}
      <AdminDashboard />

      {/* Orders table */}
      <OrdersTable />
    </section>
  )
}
