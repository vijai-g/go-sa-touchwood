import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials){
        const usersFile = path.join(process.cwd(),'data','users.json')
        if (!fs.existsSync(usersFile)) return null
        const users = JSON.parse(fs.readFileSync(usersFile,'utf8'))
        const user = users.find((u:any)=>u.email===credentials?.email)
        if (!user) return null
        const ok = await bcrypt.compare(credentials?.password || '', user.passwordHash)
        if (!ok) return null
        return { id: user.userId, email: user.email, role: user.role }
      }
    })
  ],
  session: { strategy: 'jwt', maxAge: 24*60*60 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }){
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }){
      (session as any).user.role = token.role
      return session
    }
  }
})
