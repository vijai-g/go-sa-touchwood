import Link from 'next/link'
import Image from 'next/image'
import { getHomeSettings } from '@/lib/settings'

export default async function HomePage() {
  const s = await getHomeSettings()

  const useNextImage = !s.hero.startsWith('data:')
  const img = useNextImage ? (
    <Image
      src={s.hero}
      alt="Signature handcrafted wood pieces"
      width={1600}
      height={900}
      sizes="(min-width:1024px) 50vw, 100vw"
      priority
      className="w-full h-auto rounded-2xl"
    />
  ) : (
    // data: URLs render fine with <img>; no optimizer needed
    <img src={s.hero} alt="Signature handcrafted wood pieces" className="w-full h-auto rounded-2xl" />
  )

  return (
    <section className="relative overflow-hidden rounded-3xl">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-brand-gradient" />
      <div className="grid items-center gap-10 md:grid-cols-2 p-4 md:p-8">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Go Sa <span className="text-accent">Touchwood</span>
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
