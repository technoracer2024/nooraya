/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nooraya: {
          ivory: 'var(--nooraya-ivory)',
          'warm-white': 'var(--nooraya-warm-white)',
          'champagne-gold': 'var(--nooraya-champagne-gold)',
          'antique-gold': 'var(--nooraya-antique-gold)',
          charcoal: 'var(--nooraya-charcoal)',
          'soft-grey': 'var(--nooraya-soft-grey)',
          'emergency-red': 'var(--nooraya-emergency-red)',
        }
      },
      fontFamily: {
        display: ['var(--nooraya-display-font)'],
        body: ['var(--nooraya-body-font)'],
      }
    },
  },
  plugins: [],
}
