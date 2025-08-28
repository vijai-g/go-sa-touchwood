import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Go Sa Touchwood',
  description: 'Food E-commerce'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <header className="p-4 bg-yellow-400 text-black flex justify-between">
          <h1 className="font-bold">Go Sa Touchwood</h1>
          <nav className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        <main className="p-6">{children}</main>
        <a
          href="https://wa.me/1234567890"
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          WhatsApp
        </a>
      </body>
    </html>
  );
}