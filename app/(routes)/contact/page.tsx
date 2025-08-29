import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl bg-neutral-900 border border-white/10 shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Contact</h1>
        <ContactForm />
      </div>
    </section>
  );
}
