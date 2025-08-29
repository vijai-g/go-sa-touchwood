import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent:    'var(--color-accent)',
      },
      backgroundImage: {
        'brand-gradient':
          'radial-gradient(1200px 600px at 10% 10%, rgba(255,215,0,0.15), transparent 60%), radial-gradient(800px 400px at 90% 0%, rgba(255,255,255,0.08), transparent 50%), linear-gradient(180deg, #0a0a0a, #000000)'
      }
    }
  },
  plugins: []
} satisfies Config
