import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(){
  if (process.env.PAYMENTS_MODE !== 'stripe' || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe disabled. Set PAYMENTS_MODE=stripe and STRIPE_SECRET_KEY.' }, { status: 400 })
  }
  return NextResponse.json({ error: 'Implement full Stripe flow when enabled.' }, { status: 501 })
}