import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminDashboard } from '@/components/AdminDashboard'

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
          <Link href="/admin/appearance" className="btn btn-ghost">
            Appearance
          </Link>
        </div>
      </div>

      {/* 👉 This is the products CRUD UI with Add/Edit/Delete */}
      <AdminDashboard />
    </section>
  )
}
