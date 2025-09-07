// app/(site)/page.tsx  (or wherever your HomePage is)
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
    <section class="relative z-0 overflow-hidden rounded-3xl">
      <!-- background layer -->
      <div aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-[-1] bg-body bg-brand-gradient bg-no-repeat">
      </div>

      <div class="grid items-center gap-10 md:grid-cols-2 p-4 md:p-8">
        <div class="space-y-6">
          <h1 class="text-primary text-4xl md:text-6xl font-extrabold leading-tight">
            Shop Beyond <span class="text-accent">Ordinary</span>
          </h1>
          <p class="text-primary/80 text-lg">
            An Online Marketplace For Sustainable Products
          </p>

          <div class="flex gap-3">
            <a class="btn btn-primary" href="/shop">Shop Now</a>
            <a class="btn btn-ghost" href="/about">About</a>
          </div>

          <div class="brand-underline w-40"></div>
        </div>

        <div class="rounded-2xl border border-soft bg-card shadow-2xl">
          <img src="/images/hero.jpg" alt="Shop Beyond Ordinary" class="w-full h-auto rounded-2xl">
        </div>
      </div>
    </section>

  );
}
