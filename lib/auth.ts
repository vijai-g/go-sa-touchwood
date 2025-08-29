import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'

const providers: any[] = [
  Credentials({
    name: 'credentials',
    credentials: { email: {}, password: {} },
    async authorize(creds){
      const { email, password } = creds as { email: string; password: string }
      const rows = await sql`
        select user_id, email, password_hash, role
        from users
        where lower(email) = lower(${email})
        limit 1
      ` as any
      const u = rows[0]
      if (!u) return null
      const ok = await bcrypt.compare(password, u.password_hash)
      return ok ? { id: u.user_id, email: u.email, role: u.role } as any : null
    }
  })
]

// Add Google only if envs are present (prevents runtime crash)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }))
}

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 },
  providers,
  pages: { signIn: '/login' },
  callbacks: {
  async jwt({ token, user }) {
    // persist email onto the token so we can look up role later
    (token as any).email = (user?.email ?? (token as any).email) as string | undefined;

    const email = (token as any).email as string | undefined;
    if (email) {
      const rows = await sql`
        select role from users
        where lower(email) = lower(${email})
        limit 1
      ` as any;
      (token as any).role = rows?.[0]?.role ?? 'customer';
    } else {
      (token as any).role = (token as any).role ?? 'customer';
    }
    return token;
  },

  async session({ session, token }) {
    (session as any).role = (token as any).role ?? 'customer';
    return session;
  }
}
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authConfig)

