import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

function normalizeImagePath(p: string) {
  const s = (p || '').trim();
  if (!s) return '/images/placeholder.jpg';
  return s.startsWith('/images/') ? s : `/images/${s}`;
}

// UPDATE (edit)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || (session as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const id = params.id;
  const body = await req.json();

  const name = body.name ? String(body.name).trim() : undefined;
  const description = body.description ? String(body.description).trim() : undefined;
  const category = body.category ? String(body.category).trim() : undefined;
  const image = body.image ? normalizeImagePath(String(body.image)) : undefined;
  const available = typeof body.available === 'boolean' ? body.available : undefined;

  const price = body.price !== undefined
    ? Number.parseInt(String(body.price), 10)
    : undefined;

  if (price !== undefined && (Number.isNaN(price) || price < 0)) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  await sql`
    update products set
      name = coalesce(${name}, name),
      description = coalesce(${description}, description),
      price = coalesce(${price}, price),
      image = coalesce(${image}, image),
      category = coalesce(${category}, category),
      available = coalesce(${available}, available)
    where id = ${id}
  `;

  return NextResponse.json({ ok: true });
}

// DELETE
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || (session as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await sql`delete from products where id = ${params.id}`;
  return NextResponse.json({ ok: true });
}
