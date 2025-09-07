// app/(site)/contact/page.tsx
import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl">
      {/* use the design tokens */}
      <div className="card p-6 md:p-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Contact</h1>
        <ContactForm />
      </div>
    </section>
  );
}
