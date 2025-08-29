'use client';

import Image from 'next/image'
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';

const fetcher = (u: string) => fetch(u).then(r => r.json());

type FormState = {
  id?: string;
  name: string;
  price: string; // keep as string in inputs
  description: string;
  image: string; // allow "chair.jpg" or "/images/chair.jpg"
  category: string;
  available: boolean;
};

const emptyForm: FormState = {
  name: '',
  price: '',
  description: '',
  image: '',
  category: 'furniture',
  available: true,
};

export function AdminDashboard() {
  const { data, mutate, isLoading } = useSWR<Product[]>('/api/products', fetcher);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [saving, setSaving] = useState(false);

  const products = useMemo(() => data ?? [], [data]);

  function onAddClick() {
    setMode('create');
    setForm(emptyForm);
    setOpen(true);
  }

  function onEditClick(p: Product) {
    setMode('edit');
    setForm({
      id: p.id,
      name: p.name,
      price: String(p.price),
      description: p.description,
      image: p.image.startsWith('/images/') ? p.image.replace('/images/', '') : p.image,
      category: p.category,
      available: p.available,
    });
    setOpen(true);
  }

  async function onDeleteClick(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Product deleted');
      mutate();
    } catch (e: any) {
      toast.error('Delete failed');
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim() || 'misc',
      image: form.image.trim(), // server will prefix /images/ if missing
      price: parseInt(form.price, 10),
      available: form.available,
    };
    if (!payload.name || !payload.description || Number.isNaN(payload.price)) {
      toast.error('Name, description, and a numeric price are required');
      return;
    }

    setSaving(true);
    try {
      let ok = false;
      if (mode === 'create') {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      } else {
        const res = await fetch(`/api/products/${form.id}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      }
      if (!ok) throw new Error('Request failed');
      toast.success(mode === 'create' ? 'Product created' : 'Product updated');
      setOpen(false);
      mutate();
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <button onClick={onAddClick} className="btn btn-ghost border border-white/20">Add product</button>
      </div>

      {isLoading && <div className="text-white/60">Loading…</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
{products.map((p) => {
  const src = p.image?.startsWith('/') ? p.image : `/${p.image}`;

  return (
    <div key={p.id} className="card p-4 space-y-2">
      {/* NEW: thumbnail that fits inside the card */}
      <div className="relative w-full h-40 bg-black/20 rounded-xl overflow-hidden">
        <Image
          src={src}
          alt={p.name}
          fill
          className="object-contain object-center p-2"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="font-semibold">{p.name}</div>
        <span className="badge">{p.category}</span>
      </div>
      <div className="text-white/70 text-sm line-clamp-2">{p.description}</div>

      {/* ...price + Edit/Delete buttons... */}
    </div>
  );
})}

      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <form onSubmit={onSubmit} className="card w-[min(640px,92vw)] p-6 space-y-4">
            <h2 className="text-xl font-semibold">{mode === 'create' ? 'Add product' : 'Edit product'}</h2>

            <div className="grid gap-3">
              <label className="text-sm text-white/70">Name
                <input
                  className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <label className="text-sm text-white/70">Price (INR)
                <input
                  className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
              </label>

              <label className="text-sm text-white/70">Description
                <textarea
                  className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full min-h-28"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
              </label>

              <label className="text-sm text-white/70">Image file (in <code>/public/images</code>)
                <div className="flex gap-2 mt-1">
                  <span className="inline-flex items-center px-3 rounded-xl bg-white/10 select-none">/images/</span>
                  <input
                    className="px-4 py-3 rounded-xl bg-white/10 w-full"
                    placeholder="chair.jpg"
                    value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    required
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">Put the image file in <code>public/images/</code> and enter the filename only (e.g., <code>chair.jpg</code>).</p>
              </label>

              <label className="text-sm text-white/70">Category
                <input
                  className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                />
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={e => setForm({ ...form, available: e.target.checked })}
                />
                Available
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">Cancel</button>
              <button disabled={saving} className="btn btn-primary">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
