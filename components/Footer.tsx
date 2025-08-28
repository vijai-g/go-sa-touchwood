export function Footer(){
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} Go Sa Touchwood</div>
        <div className="flex items-center gap-4">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/shop">Shop</a>
        </div>
      </div>
    </footer>
  )
}