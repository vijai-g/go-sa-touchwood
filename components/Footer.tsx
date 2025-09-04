// components/Footer.tsx
export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/40">
      {/* gradient halo rising upwards, but behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-24 -z-10 bg-gradient-to-t from-amber-500/10 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60">
        © {new Date().getFullYear()} WhiTown
      </div>
    </footer>
  );
}
