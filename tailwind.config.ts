import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8f0f9',
          100: '#c5d8ef',
          200: '#9fbfe4',
          500: '#2563a8',
          700: '#0e3468',
          900: '#0F2B4A',
          950: '#091c31',
        },
        electric: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
        },
      },
    },
  },
  plugins: [],
}
export default config
