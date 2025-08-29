import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    // gradient is ONLY here, behind content
    <section className="relative overflow-hidden rounded-3xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-brand-gradient"
      />

      <div className="grid items-center gap-10 md:grid-cols-2 p-4 md:p-8">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Go Sa <span className="text-accent">Touchwood</span>
          </h1>
          <p className="text-lg text-white/80">
            Minimal, durable wood essentials. Built for homes that love calm aesthetics.
          </p>
          <div className="flex gap-3">
            <Link href="/shop" className="btn btn-primary">Shop Now</Link>
            <Link href="/about" className="btn btn-ghost">About</Link>
          </div>
          <div className="brand-underline w-40" />
        </div>

        {/* Opaque, clipped media card (no background show-through) */}
        <div className="rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl overflow-hidden">
          <div className="relative w-full aspect-[4/3] md:aspect-[16/10]">
            <Image
              src="/images/GoSaHero.png"
              alt="Signature handcrafted wood pieces"
              fill
              className="object-cover"
              sizes="(min-width:1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
