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

// ...
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok:false, error:'Bad JSON' }, { status:400 });

  const id = crypto.randomUUID();
  const name = (body.name ?? '').trim();
  const description = (body.description ?? '').trim();
  const price = Number(body.price ?? 0);
  const category = (body.category ?? 'misc').trim();
  const available = Boolean(body.available ?? true);

  let image = String(body.image ?? '').trim();
  if (!image) return NextResponse.json({ ok:false, error:'Image required' }, { status:400 });

  const isData = image.startsWith('data:');
  const isHttp = /^https?:\/\//i.test(image);
  const isPublic = image.startsWith('/images/');
  if (!isData && !isHttp && !isPublic) image = `/images/${image}`;

  if (!name || !description || !price) {
    return NextResponse.json({ ok:false, error:'Missing fields' }, { status:400 });
  }

  await sql/*sql*/`
    insert into products (id, name, description, price, image, category, available)
    values (${id}, ${name}, ${description}, ${price}, ${image}, ${category}, ${available})
  `;
  return NextResponse.json({ ok:true, id });
}

