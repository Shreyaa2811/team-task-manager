/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070912',
          900: '#0b0f1a',
          850: '#0f1422',
          800: '#141a2b',
          700: '#1c2237',
          600: '#262d44',
          500: '#3a4361',
        },
        accent: {
          cyan: '#22d3ee',
          purple: '#a78bfa',
          pink: '#f472b6',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.25), 0 8px 30px rgba(34,211,238,0.08)',
      },
    },
  },
  plugins: [],
};
