'use client'
import Link from 'next/link'
import { CartBadge } from './CartBadge'
import { MessageCircleMore } from 'lucide-react'

export function Header(){
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL
  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="tracking-wide">Go Sa</span>
          <span className="text-accent">Touchwood</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-white/80">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <CartBadge />
          {whatsapp && (
            <a aria-label="WhatsApp" href={whatsapp} target="_blank" className="btn btn-ghost" rel="noreferrer">
              <MessageCircleMore size={18} />
              <span className="sr-only">WhatsApp</span>
            </a>
          )}
          <Link href="/login" className="btn btn-ghost">Login</Link>
        </div>
      </div>
    </header>
  )
}
