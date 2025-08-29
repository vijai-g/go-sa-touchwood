'use client'
import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import GoogleSignInButton from '@/components/GoogleSignInButton'

export function SecureLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasGoogle, setHasGoogle] = useState(false)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let ignore = false
    fetch('/api/auth/providers')
      .then(r => r.json())
      .then(p => { if (!ignore) setHasGoogle(!!p.google) })
      .catch(() => {})
    return () => { ignore = true }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (!res || res.error) { toast.error('Invalid email or password'); return }
      // read role -> send admins to /admin, customers to /
      const s = await fetch('/api/auth/session').then(r => r.json()).catch(() => null)
      const role = s?.role ?? s?.user?.role
      router.push(role === 'admin' ? '/admin' : '/')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-neutral-900 border border-white/10 shadow-lg p-6 space-y-3 max-w-md">
      <label className="block">
        <span className="text-sm text-white/70">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-white/70">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
          required
        />
      </label>

      <button type="submit" disabled={busy} className="btn btn-primary w-full">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>

      {hasGoogle && (
        <>
          <div className="relative my-2 flex items-center">
            <div className="h-px flex-1 bg-white/10" />
            <span className="mx-3 text-xs uppercase tracking-wider text-white/40">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          {/* White background, black text, Google “G” logo */}
          <GoogleSignInButton />
        </>
      )}
    </form>
  )
}
