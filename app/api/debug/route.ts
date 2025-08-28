import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const [{ count }] = await sql`select count(*)::int as count from users`;
    return NextResponse.json({ ok: true, users: count });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
