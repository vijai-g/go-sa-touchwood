import Link from 'next/link'
import Image from 'next/image'

export default function HomePage(){
  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Go Sa <span className="text-accent">Touchwood</span></h1>
        <p className="text-lg text-white/80">Minimal, durable wood essentials. Built for homes that love calm aesthetics.</p>
        <div className="flex gap-3">
          <Link href="/shop" className="btn btn-primary">Shop Now</Link>
          <Link href="/about" className="btn btn-ghost">About</Link>
        </div>
        <div className="brand-underline w-40" />
      </div>
      <div className="card p-2">
        <Image src="/images/chair.jpg" alt="Classic Wooden Chair" width={1200} height={900} className="rounded-2xl object-cover" />
      </div>
    </section>
  )
}