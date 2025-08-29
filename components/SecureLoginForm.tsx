'use client'
import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function SecureLoginForm(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasGoogle, setHasGoogle] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/providers').then(r => r.json()).then(p => setHasGoogle(!!p.google))
  }, [])

  return (
    <form
      onSubmit={async e=>{
        e.preventDefault()
        const res = await signIn('credentials', { email, password, redirect: false })
        if (res?.error) alert(res.error)
        else router.push('/admin') // admins go here; customers get normal session
      }}
      className="card p-6 space-y-3 max-w-md"
    >
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="px-4 py-3 rounded-xl bg-white/10" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="px-4 py-3 rounded-xl bg-white/10" />
      <button className="btn btn-primary w-full">Sign in</button>

      {hasGoogle && (
        <button type="button" onClick={()=>signIn('google', { callbackUrl: '/' })} className="btn btn-ghost w-full">
          Continue with Google
        </button>
      )}
    </form>
  )
}
