import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import HomeEditor from '@/components/HomeEditor'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AppearancePage() {
  const session = await auth()
  if (!session || (session as any).role !== 'admin') redirect('/')

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl bg-neutral-900 border border-white/10 shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white/80">Appearance — Home</h1>
          <a href="/admin" className="btn btn-ghost text-white/80">← Back to Products</a>
        </div>
        <HomeEditor />
      </div>
    </section>
  )
}

