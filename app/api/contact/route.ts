import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { z } from 'zod';
import crypto from 'node:crypto';

const ContactSchema = z.object({
  email: z.string().email().min(5).max(200),
  message: z.string().min(10).max(5000),
  // honeypot (should be empty)
  website: z.string().max(0).optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const ua = req.headers.get('user-agent') ?? '';
    // hash the IP (if provided by proxy) so we don't store raw IPs
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim();
    const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex') : null;

    const body = await req.json().catch(() => ({}));
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 });
    }
    // simple honeypot
    if (body.website) {
      return NextResponse.json({ ok: true }); // pretend success to bots
    }

    const { email, message } = parsed.data;
    await sql`
      insert into contact_messages (email, message, user_agent, ip_hash)
      values (${email}, ${message}, ${ua}, ${ipHash})
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('contact POST failed', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
