# Go Sa Touchwood (Free, Prod-ready)

Next.js 14 + TypeScript + Tailwind + NextAuth (credentials) + Neon Postgres (free) + optional Stripe. Black/white minimal with gold accent and rich gradients.

## Quick Start (Local)
```bash
pnpm i        # or npm/yarn
cp .env.example .env.local  # fill NEON_DATABASE_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_WHATSAPP_URL
# Create Neon DB and run the SQL:
#   open db/schema.sql in Neon SQL editor and run it
pnpm dev
```


## Deploy on Vercel (₹0)
1. Create a Neon DB (free) → copy `NEON_DATABASE_URL`.
2. Run `db/schema.sql` in Neon to create tables + seed.
3. In Vercel → Project → Settings → Environment Variables, set:
   - `NEON_DATABASE_URL`
   - `NEXTAUTH_SECRET` (strong random)
   - `PAYMENTS_MODE=cod`
   - `NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/<YOUR_NUMBER>?text=Hi%20WhiTown`
4. Push this repo to GitHub.
5. Import in Vercel → Deploy.

## Payments
- Default = COD/UPI manual (free). Orders persist in `orders` table with `status='pending'`.
- To enable Stripe later: set `PAYMENTS_MODE=stripe` and implement the Stripe session in `app/api/checkout/route.ts` (the scaffold is present).

## Notes
- Rate-limiter in `middleware.ts` is best-effort (free, ephemeral). For stronger limits, add Upstash Redis (has free tier).
- Replace or extend Admin CRUD as needed.