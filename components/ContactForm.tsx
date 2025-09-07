'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const inputCls =
  'px-4 py-3 rounded-xl bg-black/30 border border-black/20 placeholder-black/50 ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-400/60 w-full';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [hp, setHp] = useState(''); // honeypot

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, message, website: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');
      toast.success('Thanks! We’ll get back to you soon.');
      setEmail('');
      setMessage('');
    } catch {
      toast.error('Could not send message. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {/* Layout: inputs in a clean grid */}
      <label className="block">
        <span className="text-sm text-black/70">Email</span>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputCls + ' mt-1'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-black/70">Message</span>
        <textarea
          placeholder="How can we help?"
          className={inputCls + ' mt-1 min-h-40 resize-y'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </label>

      {/* Honeypot (hidden from humans) */}
      <label className="hidden" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary px-6"
          aria-disabled={busy}
        >
          {busy ? 'Sending…' : 'Send'}
        </button>
      </div>

      {/* Optional: contact info block */}
      <div className="pt-2 text-sm text-black/50">
        Prefer WhatsApp?{' '}
        <a
          className="underline decoration-black/30 hover:decoration-amber-400"
          href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '#'}
          target="_blank"
          rel="noreferrer"
        >
          Message us
        </a>
      </div>
    </form>
  );
}
