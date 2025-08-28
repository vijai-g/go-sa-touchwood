'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export function SecureLoginForm(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <form onSubmit={async e=>{ e.preventDefault(); await signIn('credentials', { email, password, callbackUrl: '/admin' }) }} className="card p-6 space-y-3 max-w-md">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="px-4 py-3 rounded-xl bg-white/10" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="px-4 py-3 rounded-xl bg-white/10" />
      <button className="btn btn-primary w-full">Sign in</button>
    </form>
  )
}