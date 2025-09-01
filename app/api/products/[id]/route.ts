import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

function normalizeImagePath(p: string) {
  const s = (p || '').trim();
  if (!s) return '/images/placeholder.jpg';
  return s.startsWith('/images/') ? s : `/images/${s}`;
}

// ...
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok:false, error:'Bad JSON' }, { status:400 });

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

  await sql/*sql*/`
    update products
    set name=${name}, description=${description}, price=${price},
        image=${image}, category=${category}, available=${available}
    where id=${params.id}
  `;
  return NextResponse.json({ ok:true });
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
