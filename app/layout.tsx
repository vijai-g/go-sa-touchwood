import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'go sa touchwood',
  description: 'Go Sa Touchwood - handcrafted goods'
}

export default function RootLayout({ children }:{children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-white text-black'}>
        <header style={{padding:16, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{fontWeight:700}}>go sa touchwood</div>
          <nav>
            <a href="/" style={{marginRight:12}}>Home</a>
            <a href="/shop" style={{marginRight:12}}>Shop</a>
            <a href="/admin">Admin</a>
          </nav>
        </header>
        <main style={{padding:24}}>{children}</main>
        <a href="https://wa.me/<YOUR_NUMBER>?text=Hi%20GoSaTouchwood" style={{position:'fixed', right:16, bottom:16, background:'#25D366', padding:12, borderRadius:999, color:'#fff', textDecoration:'none'}}>WhatsApp</a>
      </body>
    </html>
  )
}
