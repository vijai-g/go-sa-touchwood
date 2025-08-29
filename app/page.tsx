// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getHomeSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function Title({ text }: { text: string }) {
  const lc = text.toLowerCase()
  const needle = 'touchwood'
  const i = lc.indexOf(needle)
  if (i === -1) return <>{text}</>
  const before = text.slice(0, i)
  const match = text.slice(i, i + needle.length)
  const after = text.slice(i + needle.length)
  return (
    <>
      {before}
      <span className="text-accent">{match}</span>
      {after}
    </>
  )
}

export default async function HomePage() {
  const s = await getHomeSettings()

  const useNextImage = !s.hero.startsWith('data:')
  const img = useNextImage ? (
    <Image
      src={s.hero}
      alt={s.title}
      width={1600}
      height={900}
      sizes="(min-width:1024px) 50vw, 100vw"
      priority
      className="w-full h-auto rounded-2xl"  // scales; no crop
    />
  ) : (
    <img src={s.hero} alt={s.title} className="w-full h-auto rounded-2xl" />
  )

  return (
    <section className="relative overflow-hidden rounded-3xl">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-brand-gradient" />
      <div className="grid items-center gap-10 md:grid-cols-2 p-4 md:p-8">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            <Title text={s.title} />
          </h1>
          <p className="text-lg text-white/80">{s.description}</p>
          <div className="flex gap-3">
            <Link href="/shop" className="btn btn-primary">Shop Now</Link>
            <Link href="/about" className="btn btn-ghost">About</Link>
          </div>
          <div className="brand-underline w-40" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
          {img}
        </div>
      </div>
    </section>
  )
}
