import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ColorEditor from '@/components/ColorEditor'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ColorPage() {
  const session = await auth()
  if (!session || (session as any).role !== 'admin') redirect('/')
  return (
    <section className="mx-auto max-w-3xl">
      <div className="card p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Theme Colors</h1>
          <a href="/admin" className="btn btn-ghost">← Back</a>
        </div>
        <ColorEditor />
      </div>
    </section>
  )
}
