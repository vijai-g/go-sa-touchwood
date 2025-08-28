import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: { email: {}, password: {} },
      async authorize(creds){
        const { email, password } = creds as { email: string; password: string }
        const rows = await sql`select user_id, email, password_hash, role from users where email = ${email} limit 1` as any
        const u = rows[0]
        if (!u) return null
        const ok = await bcrypt.compare(password, u.password_hash)
        return ok ? { id: u.user_id, email: u.email, role: u.role } as any : null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }){ if (user) (token as any).role = (user as any).role ?? 'customer'; return token },
    async session({ session, token }){ (session as any).role = (token as any).role; return session }
  }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authConfig)
