import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Go Sa Touchwood',
  description: 'Handcrafted wood, minimal aesthetics, daily utility.',
  metadataBase: new URL('https://gosatouchwood.com'),
  openGraph: {
    title: 'Go Sa Touchwood',
    description: 'Handcrafted wood, minimal aesthetics, daily utility.',
    type: 'website'
  },
  icons: { icon: '/favicon.ico' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}