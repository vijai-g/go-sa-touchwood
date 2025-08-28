'use client'
export function CategoryFilter({ categories, value, onChange }: { categories: string[]; value: string; onChange: (v:string)=>void }){
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} className="px-4 py-2 rounded-xl bg-white/10 border border-white/20">
      {categories.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  )
}