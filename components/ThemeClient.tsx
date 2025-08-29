'use client'
import { useEffect } from 'react'

export default function ThemeClient() {
  useEffect(() => {
    (async () => {
      try {
        const t = await fetch('/api/settings/theme', { cache: 'no-store' }).then(r => r.json())
        if (!t) return
        const root = document.documentElement.style
        root.setProperty('--color-primary',  t.primary)
        root.setProperty('--color-secondary',t.secondary)
        root.setProperty('--color-accent',   t.accent)
        root.setProperty('--color-body',     t.body)
        root.setProperty('--color-card',     t.card)
      } catch {}
    })()
  }, [])
  return null
}
