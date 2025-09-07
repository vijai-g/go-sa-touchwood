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

// Accent just the word “Touchwood” if present; otherwise the last word
function Title({ text }: { text: string }) {
  const t = (text ?? "").trim();
  if (!t) return null;

  const lc = t.toLowerCase();
  const needle = "touchwood";
  const i = lc.indexOf(needle);
  if (i !== -1) {
    const before = t.slice(0, i);
    const match = t.slice(i, i + needle.length);
    const after = t.slice(i + needle.length);
    return (
      <>
        {before}
        <span className="text-accent">{match}</span>
        {after}
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
    <section className="relative z-0 overflow-hidden rounded-3xl bg-white">
      {/* light brand gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[-1] bg-body bg-brand-gradient bg-no-repeat"
      />

      <div className="grid items-center gap-10 md:grid-cols-2 p-4 md:p-8">
        <div className="space-y-6">
          {/* Kill forced white; keep readable ink. Also lighten the shadow. */}
          <h1 className="text-primary text-4xl md:text-6xl font-extrabold leading-tight [text-shadow:_0_1px_3px_rgba(0,0,0,.18)]">
            <Title text={s.title} />
          </h1>

          <p className="text-primary/70 text-lg [text-shadow:_0_1px_2px_rgba(0,0,0,.12)]">
            {s.description}
          </p>

          <div className="flex gap-3">
            <Link href="/shop" className="btn btn-primary">
              Shop Now
            </Link>
            <Link href="/about" className="btn btn-ghost">
              About
            </Link>
          </div>

          <div className="brand-underline w-40" />
        </div>

        {/* Remove hardcoded darks: use bg-card + border-soft */}
        <div className="rounded-2xl border border-soft bg-card shadow-2xl">
          {img}
        </div>
      </div>
    </section>
  );
}
