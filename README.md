# go sa touchwood - Local Dev

This is a starter Next.js 13 (App Router) TypeScript project scaffold for the "go sa touchwood" e-commerce site.

## Quick start (local)

1. Copy `.env.example` to `.env.local` and set values (NEXTAUTH_SECRET, STRIPE keys).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed data (creates `data/users.json`, `data/products.json`, `data/orders.json`):
   ```bash
   npm run seed
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```
5. Default admin:
   - Email: `admin@gosatouchwood.com`
   - Password: `password123`

Stripe is configured conceptually for **test mode only**. Replace keys in `.env.local`.

