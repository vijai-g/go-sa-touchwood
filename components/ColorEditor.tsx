'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Theme = { primary:string; secondary:string; accent:string; body:string; card:string }
const input = 'px-4 py-3 rounded-xl bg-white/10 border border-white/20 w-full'


export default function ColorEditor(){
  const [t, setT] = useState<Theme|null>(null)
  const [saving, setSaving] = useState(false)

  // live preview via CSS vars
  useEffect(() => {
    // inside useEffect that previews on change:
if (t) {
  const root = document.documentElement.style
  const to = (hex:string) => {
    const h = hex.replace('#',''); const v=(s:string)=>parseInt(s.length===1?s+s:s,16)
    const r=v(h.slice(0,h.length===3?1:2)), g=v(h.slice(h.length===3?1:2,h.length===3?2:4)), b=v(h.slice(h.length===3?2:4,h.length===3?3:6))
    return `${r} ${g} ${b}`
  }
  root.setProperty('--color-primary',   to(t.primary))
  root.setProperty('--color-secondary', to(t.secondary))
  root.setProperty('--color-accent',    to(t.accent))
  root.setProperty('--color-body',      to(t.body))
  root.setProperty('--color-card',      to(t.card))
}

  }, [t])

  

  useEffect(() => {
    fetch('/api/settings/theme', { cache:'no-store' })
      .then(r=>r.json()).then(setT)
      .catch(()=>setT({ primary:'#000000', secondary:'#FFFFFF', accent:'#FFD700', body:'#0a0a0a', card:'#111111' }))
  }, [])

  async function save(){
    if (!t) return
    setSaving(true)
    try{
      const r = await fetch('/api/settings/theme', {
        method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(t)
      })
      if (!r.ok) throw new Error()
      toast.success('Theme saved')
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!t) return <div className="text-white/60">Loading…</div>

  return (
    <div className="grid gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Primary (brand/dark text)"   value={t.primary}   onChange={v=>setT({...t, primary:v})} />
        <Field label="Secondary (light text)"      value={t.secondary} onChange={v=>setT({...t, secondary:v})} />
        <Field label="Accent (gold)"               value={t.accent}    onChange={v=>setT({...t, accent:v})} />
        <Field label="Body background"             value={t.body}      onChange={v=>setT({...t, body:v})} />
        <Field label="Card background"             value={t.card}      onChange={v=>setT({...t, card:v})} />
      </div>

      <div className="card p-5 space-y-3">
        <div className="text-sm text-white/60">Preview</div>
        <h2 className="text-2xl font-bold">Go Sa <span className="text-accent">Touchwood</span></h2>
        <p className="text-white/80">Minimal, durable wood essentials. Built for homes that love calm aesthetics.</p>
        <div className="flex gap-2">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-ghost">Ghost</button>
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

function Field({label, value, onChange}:{label:string; value:string; onChange:(v:string)=>void}){
  return (
    <label className="block">
      <span className="text-sm text-white/70">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input type="color" value={value} onChange={e=>onChange(e.target.value)}
               className="h-10 w-12 rounded-lg bg-transparent border border-white/20" />
        <input value={value} onChange={e=>onChange(e.target.value)} className={input} />
      </div>
    </label>
  )
}
