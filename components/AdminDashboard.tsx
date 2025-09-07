'use client';

import useSWR from 'swr';
import toast from 'react-hot-toast';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';

const fetcher = (u: string) => fetch(u).then(r => r.json());

type ImageKind = 'library' | 'url' | 'upload';

type FormState = {
  id?: string;
  name: string;
  price: string;
  description: string;
  image: string;        // final string sent to server: "/images/x.jpg" | "https://..." | "data:image/..."
  category: string;
  available: boolean;
  imageKind: ImageKind; // which UI is active
  libraryName: string;  // just the filename when using library
  urlValue: string;     // full URL when using url
};

const emptyForm: FormState = {
  name: '',
  price: '',
  description: '',
  image: '',
  category: 'misc',
  available: true,
  imageKind: 'library',
  libraryName: '',
  urlValue: '',
};

export function AdminDashboard() {
  const { data, mutate, isLoading } = useSWR<Product[]>('/api/products', fetcher);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mode, setMode] = useState<'create'|'edit'>('create');
  const [saving, setSaving] = useState(false);

  const products = useMemo(() => data ?? [], [data]);

  function computeFinalImage(next: Partial<FormState>, base: FormState = form) {
    const fk = next.imageKind ?? base.imageKind;
    if (fk === 'library') {
      const name = (next.libraryName ?? base.libraryName).trim();
      return name ? (name.startsWith('/images/') ? name : `/images/${name}`) : '';
    }
    if (fk === 'url') {
      return (next.urlValue ?? base.urlValue).trim();
    }
    // upload: form.image already holds data:URL from FileReader
    return (next.image ?? base.image).trim();
  }

  function onAddClick() {
    setMode('create');
    setForm(emptyForm);
    setOpen(true);
  }

  function onEditClick(p: Product) {
    // infer kind
    let imageKind: ImageKind = 'library';
    let libraryName = '';
    let urlValue = '';
    if (p.image?.startsWith('data:')) imageKind = 'upload';
    else if (/^https?:\/\//i.test(p.image)) { imageKind = 'url'; urlValue = p.image; }
    else if (p.image?.startsWith('/images/')) { imageKind = 'library'; libraryName = p.image.replace('/images/',''); }
    else { imageKind = 'url'; urlValue = p.image; }

    setMode('edit');
    setForm({
      id: p.id,
      name: p.name,
      price: String(p.price),
      description: p.description,
      image: p.image,
      category: p.category,
      available: p.available,
      imageKind,
      libraryName,
      urlValue,
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
    } catch {
      toast.error('Delete failed');
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalImage = computeFinalImage({});
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim() || 'misc',
      image: finalImage,                     // can be /images/..., http(s)://..., or data:...
      price: parseInt(form.price, 10),
      available: form.available,
    };
    if (!payload.name || !payload.description || Number.isNaN(payload.price) || !payload.image) {
      toast.error('Name, description, numeric price, and image are required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(mode === 'create' ? '/api/products' : `/api/products/${form.id}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      toast.success(mode === 'create' ? 'Product created' : 'Product updated');
      setOpen(false);
      mutate();
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }

  // handlers
  function setImageKind(k: ImageKind) {
    const next = { ...form, imageKind: k };
    // keep image in sync with current sub-field
    next.image = computeFinalImage(next);
    setForm(next);
  }

  function onLibraryChange(v: string) {
    const next = { ...form, libraryName: v };
    next.image = computeFinalImage(next);
    setForm(next);
  }

  function onUrlChange(v: string) {
    const next = { ...form, urlValue: v };
    next.image = computeFinalImage(next);
    setForm(next);
  }

  async function onFilePicked(file?: File) {
    if (!file) return;
    // basic size guard (keep small; data URLs bloat)
    if (file.size > 800_000) {
      toast.error('Image too large (>800KB). Resize for now to keep it free.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      // ✅ narrow 'upload' so TS doesn't widen to string
      setForm(prev => ({ ...prev, imageKind: 'upload' as const, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <button onClick={onAddClick} className="btn btn-ghost border border-white/20">Add product</button>
      </div>

      {isLoading && <div className="text-black/60">Loading…</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => {
          const sold = !p.available;
          return (
            <div key={p.id} className="card p-4 space-y-2">
              <div className="relative w-full h-40 bg-black/20 rounded-xl overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className={`w-full h-full object-contain p-2 transition ${sold ? 'grayscale opacity-60' : ''}`}
                />
                {!sold && <></>}
                {sold && (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="badge bg-white/90 text-black">Sold out</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.name}</div>
                <span className="badge">{p.category}</span>
              </div>
              <div className="text-black/70 text-sm line-clamp-2">{p.description}</div>

              <div className="flex items-center justify-between pt-2">
                <div>₹{p.price}</div>
                <div className="flex gap-2">
                  <button onClick={() => onEditClick(p)} className="btn btn-ghost text-black/80">Edit</button>
                  <button onClick={() => onDeleteClick(p)} className="btn btn-ghost text-black/80">Delete</button>
                </div>
              </div>
              <div className="text-xs text-black/40 break-all">img: {p.image.slice(0,90)}{p.image.length>90?'…':''}</div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <form onSubmit={onSubmit} className="card w-[min(680px,96vw)] p-6 space-y-4">
            <h2 className="text-xl font-semibold">{mode === 'create' ? 'Add product' : 'Edit product'}</h2>

            <div className="grid gap-3">
              <label className="text-sm text-black/80">Name
                <input className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <label className="text-sm text-black/80">Price (INR)
                <input className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
              </label>

              <label className="text-sm text-black/80">Description
                <textarea className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full min-h-28"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
              </label>

              {/* Image picker */}
              <div>
                <div className="text-sm text-black/80 mb-2">Product image</div>
                <div className="flex flex-wrap gap-2">
                  <button type="button"
                    className={`btn btn-ghost ${form.imageKind==='library'?'border border-white/40':''}`}
                    onClick={()=>setImageKind('library')}>From library</button>
                  <button type="button"
                    className={`btn btn-ghost ${form.imageKind==='url'?'border border-white/40':''}`}
                    onClick={()=>setImageKind('url')}>Paste URL</button>
                  <button type="button"
                    className={`btn btn-ghost ${form.imageKind==='upload'?'border border-white/40':''}`}
                    onClick={()=>setImageKind('upload')}>Upload file</button>
                </div>

                {form.imageKind === 'library' && (
                  <label className="block mt-2 text-sm text-black/70">
                    <span>File name (in <code>public/images</code>)</span>
                    <div className="flex gap-2 mt-1">
                      <span className="inline-flex items-center px-3 rounded-xl bg-white/10 select-none">/images/</span>
                      <input
                        className="px-4 py-3 rounded-xl bg-white/10 w-full"
                        placeholder="chair.jpg"
                        value={form.libraryName}
                        onChange={(e)=>onLibraryChange(e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-xs text-black/50 mt-1">Put the file under <code>public/images/</code> and type the name only.</p>
                  </label>
                )}

                {form.imageKind === 'url' && (
                  <label className="block mt-2 text-sm text-black/70">
                    <span>Image URL (https://…)</span>
                    <input
                      className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
                      placeholder="https://example.com/pic.jpg"
                      value={form.urlValue}
                      onChange={(e)=>onUrlChange(e.target.value)}
                      required
                    />
                  </label>
                )}

                {form.imageKind === 'upload' && (
                  <label className="block mt-2 text-sm text-black/70">
                    <span>Choose file (kept inline as data URL)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-1 block"
                      onChange={e=>onFilePicked(e.target.files?.[0])}
                      required={!form.image}
                    />
                    <p className="text-xs text-black/50 mt-1">Keep images small (&lt; 800KB) to stay fast & free.</p>
                  </label>
                )}

                {/* preview */}
                {computeFinalImage({}) && (
                  <div className="rounded-xl bg-white/5 p-3 mt-3">
                    <div className="text-xs mb-1 text-black/60">Preview</div>
                    <div className="relative w-full h-40 bg-black/20 rounded-xl overflow-hidden">
                      <img src={computeFinalImage({})} alt="preview" className="w-full h-full object-contain p-2" />
                    </div>
                  </div>
                )}
              </div>

              <label className="text-sm text-black/80">Category
                <input className="mt-1 px-4 py-3 rounded-xl bg-white/10 w-full"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                />
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-black/80">
                <input type="checkbox" checked={form.available}
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
