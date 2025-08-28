// lib/stripe.ts
import Stripe from 'stripe';

// Keep it simple: don't pin apiVersion. Use account default when/if enabled.
// Export a lazy getter so we don't construct without a key in COD mode.
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe disabled: STRIPE_SECRET_KEY not set');
  }
  return new Stripe(key);
}
