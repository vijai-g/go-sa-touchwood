import Link from 'next/link';
import { auth } from '@/lib/auth';
import { CartBadge } from './CartBadge';
import { MessageCircleMore, User2 } from 'lucide-react';
import { SignOutButton } from './SignOutButton';

export default async function Header() {
  const session = await auth();
  const isAuthed = !!session;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL;
  const v = process.env.NEXT_PUBLIC_ASSET_VERSION ?? '1';


  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <img src={`/logo.svg?v=${v}`} alt="Go Sa Touchwood" className="h-6 w-auto" />
          <span className="text-accent">Touchwood</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-white/80">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {isAuthed && <Link href="/myorders">My Orders</Link>}
        </nav>

        <div className="flex items-center gap-3">
          <CartBadge />
          {whatsapp && (
            <a aria-label="WhatsApp" href={whatsapp} target="_blank" className="btn btn-ghost" rel="noreferrer">
              <MessageCircleMore size={18} />
              <span className="sr-only">WhatsApp</span>
            </a>
          )}

          {isAuthed ? (
            <>
              <Link href="/myorders" className="btn btn-ghost" title="My Orders">
                <User2 size={18} />
                <span className="hidden sm:inline">My Orders</span>
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/login" className="btn btn-ghost">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
