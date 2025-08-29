import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

type CreateBody = {
  name: string;
  description: string;
  price: number | string;
  image: string;        // e.g. /images/chair.jpg
  category: string;
  tags?: string[];
  available?: boolean;
};

function normalizeImagePath(p: string) {
  const s = (p || '').trim();
  if (!s) return '/images/placeholder.jpg';
  // allow either "chair.jpg" or "/images/chair.jpg"
  return s.startsWith('/images/') ? s : `/images/${s}`;
}

export async function GET() {
  const rows = await sql`
    select id, name, description, price, image, category, tags, available
    from products
    order by created_at nulls last, name
  ` as any;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const b = (await req.json()) as CreateBody;

  const name = String(b.name ?? '').trim();
  const description = String(b.description ?? '').trim();
  const category = String(b.category ?? '').trim() || 'misc';
  const image = normalizeImagePath(String(b.image ?? ''));
  const price = Number.parseInt(String(b.price ?? ''), 10);
  const available = b.available ?? true;
  const tags = Array.isArray(b.tags) ? b.tags : ['misc'];

  if (!name || !description || Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const id = crypto.randomUUID();

  await sql`
    insert into products (id, name, description, price, image, category, tags, available)
    values (${id}, ${name}, ${description}, ${price}, ${image}, ${category}, ${tags}, ${available})
  `;

  return NextResponse.json({ ok: true, id });
}
