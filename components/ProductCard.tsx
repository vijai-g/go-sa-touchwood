'use client'

import Image from 'next/image';
import { useCart } from '@/lib/cart'
import { currency } from '@/lib/utils'
import type { Product } from '@/lib/types';

export function ProductCard({ product: p }: { product: Product }) {
  return (
    <div className="card p-0 overflow-hidden rounded-2xl"> {/* clip children */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src={p.image}                // e.g. /images/chair.jpg
          alt={p.name}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"     // fill the frame without stretching
          priority={false}
        />
      </div>

      <div className="p-4">
        {/* ... name/price/buttons exactly as you had ... */}
      </div>
    </div>
  );
}
