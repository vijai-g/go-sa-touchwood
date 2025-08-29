'use client'
import { signIn } from 'next-auth/react'

export default function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn('google', { callbackUrl: '/' })}
      className="w-full inline-flex items-center justify-center gap-3
                 rounded-xl border border-black/10 bg-white text-black
                 px-4 py-3 font-medium transition
                 hover:bg-white/90 active:scale-[.99]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      aria-label="Sign In with Google"
    >
      {/* Google G logo (inline SVG) */}
      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="#4285F4" d="M21.35 11.1h-9.17v2.98h5.24c-.23 1.2-.93 2.22-1.98 2.9v2.4h3.2c1.87-1.72 2.95-4.25 2.95-7.27 0-.7-.06-1.38-.24-2.01z"/>
        <path fill="#34A853" d="M12.18 22c2.68 0 4.92-.89 6.56-2.43l-3.2-2.4c-.89.6-2.05.95-3.36.95-2.58 0-4.76-1.74-5.54-4.07H3.32v2.54A9.81 9.81 0 0 0 12.18 22z"/>
        <path fill="#FBBC05" d="M6.64 14.05a5.89 5.89 0 0 1 0-4.1V7.4H3.32a9.81 9.81 0 0 0 0 9.2l3.32-2.55z"/>
        <path fill="#EA4335" d="M12.18 6.58c1.45 0 2.76.49 3.79 1.45l2.82-2.82C17.08 3.42 14.86 2.5 12.18 2.5 8.5 2.5 5.33 4.61 3.32 7.4l3.32 2.55c.78-2.33 2.96-4.07 5.54-4.07z"/>
      </svg>
      <span>Sign In with Google</span>
    </button>
  )
}
