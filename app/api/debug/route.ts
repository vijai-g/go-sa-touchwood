import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  const email = 'admin@gosatouchwood.com';
  const rows = await sql`select email, password_hash from users where lower(email)=lower(${email}) limit 1` as any;
  const u = rows[0];
  if (!u) return NextResponse.json({ ok: false, reason: 'no-user' });
  const ok = await bcrypt.compare('password', u.password_hash);
  return NextResponse.json({ ok: true, bcrypt: ok });
}
