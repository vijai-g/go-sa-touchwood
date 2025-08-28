import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';

// TEMP endpoint: sets admin password hash via server, then verifies with bcrypt.
// REMOVE THIS FILE AFTER SUCCESSFUL LOGIN.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pw = url.searchParams.get('pw') || 'password'; // default to "password"
  const email = (url.searchParams.get('email') || 'admin@gosatouchwood.com').toLowerCase();

  try {
    const hash = await bcrypt.hash(pw, 10);
    await sql`update users set password_hash=${hash}, role='admin' where lower(email)=lower(${email})`;
    const rows = await sql`select email, password_hash from users where lower(email)=lower(${email}) limit 1` as any;
    const u = rows[0];
    if (!u) return NextResponse.json({ ok: false, reason: 'no-user' }, { status: 404 });

    const ok = await bcrypt.compare(pw, u.password_hash);
    return NextResponse.json({ ok, email, testPassword: pw });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
