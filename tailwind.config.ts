import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* classes like text-primary, bg-card, bg-body, text-accent, bg-forest */
        primary:   'rgb(var(--color-primary) / <alpha-value>)',   // #0B0F0C
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)', // #FFFFFF
        accent:    'rgb(var(--color-accent) / <alpha-value>)',    // #D3940D
        body:      'rgb(var(--color-body) / <alpha-value>)',      // #E9F1E7
        card:      'rgb(var(--color-card) / <alpha-value>)',      // #FAFAF5
        forest:    'rgb(var(--color-forest) / <alpha-value>)',    // #516636
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      backgroundImage: {
        /* subtle accent haze for hero sections (keep light theme) */
        'brand-gradient':
          'radial-gradient(800px 400px at 10% 5%, rgba(211,148,13,0.12), transparent 60%), radial-gradient(600px 300px at 90% 0%, rgba(11,15,12,0.05), transparent 50%)'
      }
    }
  },
  plugins: []
} satisfies Config
