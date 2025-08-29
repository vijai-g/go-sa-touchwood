'use client'
import { useEffect } from 'react'

function hexToTriplet(hex: string): string {
  const h = hex.replace('#', '')
  const to255 = (s: string) => parseInt(s.length === 1 ? s + s : s, 16)
  const r = to255(h.slice(0, h.length === 3 ? 1 : 2))
  const g = to255(h.slice(h.length === 3 ? 1 : 2, h.length === 3 ? 2 : 4))
  const b = to255(h.slice(h.length === 3 ? 2 : 4, h.length === 3 ? 3 : 6))
  return `${r} ${g} ${b}`
}

export default function ThemeClient() {
  useEffect(() => {
    (async () => {
      try {
        const t = await fetch('/api/settings/theme', { cache: 'no-store' }).then(r => r.json())
        if (!t) return
        const root = document.documentElement.style
        root.setProperty('--color-primary',   hexToTriplet(t.primary))
        root.setProperty('--color-secondary', hexToTriplet(t.secondary))
        root.setProperty('--color-accent',    hexToTriplet(t.accent))
        root.setProperty('--color-body',      hexToTriplet(t.body))
        root.setProperty('--color-card',      hexToTriplet(t.card))
      } catch {}
    })()
  }, [])
  return null
}
