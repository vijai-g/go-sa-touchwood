import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import HomeEditor from '@/components/HomeEditor'

export default async function AppearancePage() {
  const session = await auth()
  if (!session || (session as any).role !== 'admin') redirect('/')
  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl bg-neutral-900 border border-white/10 shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Appearance — Home</h1>
        <HomeEditor />
      </div>
    </section>
  )
}
