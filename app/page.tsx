// app/(site)/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getHomeSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const s = await getHomeSettings();
  return { title: s.title, description: s.description };
}

// Accent “Touchwood”, else last word.
function Title({ text }: { text?: string }) {
  const t = (text ?? "").trim();
  if (!t) return null;

  const lc = t.toLowerCase();
  const k = "touchwood";
  const i = lc.indexOf(k);
  if (i !== -1) {
    return (
      <>
        {t.slice(0, i)}
        <span className="text-accent">{t.slice(i, i + k.length)}</span>
        {t.slice(i + k.length)}
      </>
    );
  }
  const parts = t.split(/\s+/);
  const last = parts.pop()!;
  return (
    <>
      {parts.length ? parts.join(" ") + " " : ""}
      <span className="text-accent">{last}</span>
    </>
  );
}

export default async function HomePage() {
  const s = await getHomeSettings();

  const useNextImage = !s.hero.startsWith("data:");
  const img = useNextImage ? (
    <Image
      src={s.hero}
      alt={s.title}
      width={1600}
      height={900}
      sizes="(min-width:1024px) 50vw, 100vw"
      priority
      className="w-full h-auto rounded-2xl"
    />
  ) : (
    <img src={s.hero} alt={s.title} className="w-full h-auto rounded-2xl" />
  );

  return (
    <section className="relative overflow-hidden rounded-3xl">
      {/* gradient behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-brand-gradient" />

      <div className="grid items-center gap-10 md:grid-cols-2 p-4 md:p-8">
        {/* Copy column — force readable text here ONLY */}
        <div className="space-y-6 relative z-10">
          <h1 className="!text-white text-4xl md:text-6xl font-extrabold leading-tight [text-shadow:0_2px_10px_rgba(0,0,0,.35)]">
            <Title text={s.title} />
          </h1>

          <p className="!text-white/90 text-lg leading-7 [text-shadow:0_1px_6px_rgba(0,0,0,.3)]">
            {s.description}
          </p>

          <div className="flex gap-3">
            <Link href="/shop" className="btn btn-primary">Shop Now</Link>
            <Link href="/about" className="btn btn-ghost">About</Link>
          </div>

          <div className="brand-underline w-40" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
          {img}
        </div>
      </div>
    </section>
  );
}
