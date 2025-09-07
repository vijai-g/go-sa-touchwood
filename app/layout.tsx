import './globals.css'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'
import ThemeClient from '@/components/ThemeClient'

export const metadata: Metadata = {
  title: 'Go Sa Touchwood',
  description: 'Handcrafted wood, minimal aesthetics, daily utility.',
  metadataBase: new URL('https://whitown.com'),
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
      {/* Ensure light theme contrast out of the box */}
      <body className="min-h-screen flex flex-col bg-body text-primary">
        <ThemeClient />
        <Header />
        <main className="flex-1 relative mx-auto max-w-6xl px-4 py-8">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
