'use client'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

type Data = {
  title: string
  description: string
  hero: string
  kind: 'public' | 'data' | 'url'
}

const input = 'px-4 py-3 rounded-xl bg-white/10 border border-white/20 w-full'

export default function HomeEditor() {
  const [data, setData] = useState<Data | null>(null)
  const [gallery, setGallery] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState<'gallery'|'upload'|'url'>('gallery')
  const [url, setUrl] = useState('')

  useEffect(() => {
    fetch('/api/settings/home').then(r=>r.json()).then(setData).catch(()=>setData({
      title: 'Go Sa Touchwood',
      description: 'Minimal, durable wood essentials. Built for homes that love calm aesthetics.',
      hero: '/images/GoSaHero.png', kind:'public'
    }))
    fetch('/api/gallery').then(r=>r.json()).then(d=>setGallery(d.files||[])).catch(()=>setGallery([]))
  }, [])

  const previewSrc = useMemo(() => {
    if (!data) return ''
    if (source === 'gallery') return data.kind === 'public' ? data.hero : (gallery[0] || '')
    if (source === 'upload') return data.kind === 'data' ? data.hero : ''
    return url
  }, [data, source, url, gallery])

  function pickFromGallery(src: string) {
    setData(d => d ? { ...d, hero: src, kind:'public' } : d)
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 2 * 1024 * 1024) { // 2MB guard
      toast.error('Please pick an image under 2MB')
      return
    }
    const b64 = await new Promise<string>((res, rej) => {
      const fr = new FileReader()
      fr.onload = () => res(String(fr.result))
      fr.onerror = rej
      fr.readAsDataURL(f)
    })
    setData(d => d ? { ...d, hero: b64, kind:'data' } : d)
  }

  async function save() {
    if (!data) return
    setSaving(true)
    try {
      const body: Data = {
        title: data.title.trim(),
        description: data.description.trim(),
        hero: data.hero.trim(),
        kind: data.kind
      }
      if (source === 'url') {
        if (!/^https?:\/\//i.test(url)) { toast.error('Enter a valid http(s) URL'); setSaving(false); return }
        body.hero = url.trim(); body.kind = 'url'
      }
      const r = await fetch('/api/settings/home', {
        method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body)
      })
      if (!r.ok) throw new Error()
      toast.success('Saved')
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!data) return <div className="text-white/60">Loading…</div>

  return (
    <div className="grid gap-5">
      <label className="block">
        <span className="text-sm text-white/70">Title</span>
        <input className={input+' mt-1'} value={data.title} onChange={e=>setData({...data, title:e.target.value})}/>
      </label>

      <label className="block">
        <span className="text-sm text-white/70">Description</span>
        <textarea className={input+' mt-1 min-h-28'} value={data.description}
          onChange={e=>setData({...data, description:e.target.value})}/>
      </label>

      <div className="grid gap-3">
        <span className="text-sm text-white/70">Hero Image</span>

        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setSource('gallery')} className={`btn ${source==='gallery'?'btn-primary':'btn-ghost'}`}>Gallery</button>
          <button onClick={()=>setSource('upload')}  className={`btn ${source==='upload' ?'btn-primary':'btn-ghost'}`}>Upload</button>
          <button onClick={()=>setSource('url')}     className={`btn ${source==='url'    ?'btn-primary':'btn-ghost'}`}>Link</button>
        </div>

        {source === 'gallery' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {gallery.map(src=>(
              <button key={src} onClick={()=>pickFromGallery(src)}
                className={`relative rounded-xl overflow-hidden border ${data.hero===src ? 'border-amber-400' : 'border-white/10'}`}>
                {/* plain img is fine here */}
                <img src={src} alt="" className="block w-full h-24 object-cover" />
              </button>
            ))}
            {!gallery.length && <div className="text-white/50">No images found in <code>/public/images</code></div>}
          </div>
        )}

        {source === 'upload' && (
          <input type="file" accept="image/*" onChange={onFile}
                 className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 w-full"/>
        )}

        {source === 'url' && (
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…"
                 className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 w-full"/>
        )}

        {/* Live preview */}
        <div className="mt-2">
          <div className="text-sm text-white/70 mb-2">Preview</div>
          <div className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
            {previewSrc ? (
              <img src={previewSrc} alt="Preview" className="w-full h-auto" />
            ) : (
              <div className="p-6 text-white/50">Pick an image…</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn btn-primary px-6">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
