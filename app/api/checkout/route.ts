// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST() {
  if (process.env.PAYMENTS_MODE !== 'stripe') {
    return NextResponse.json(
      { error: 'Stripe disabled. Set PAYMENTS_MODE=stripe and add STRIPE_SECRET_KEY.' },
      { status: 400 }
    );
  }

  // If you turn Stripe on later, continue here:
  const stripe = getStripe();
  // TODO: create Checkout Session etc.
  return NextResponse.json({ error: 'Stripe flow not implemented yet.' }, { status: 501 });
}
