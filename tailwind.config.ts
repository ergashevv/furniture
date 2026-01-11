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
        primary: {
          DEFAULT: '#0F1F2E',
          dark: '#0A151F',
          light: '#1A2F3F',
        },
        secondary: {
          DEFAULT: '#D6B98C',
          dark: '#C4A572',
          light: '#E8D4B0',
        },
        background: {
          DEFAULT: '#F9F6F1',
          dark: '#F5F0E6',
        },
        text: {
          DEFAULT: '#2C2C2C',
          light: '#666666',
          dark: '#1A1A1A',
        },
        accent: {
          DEFAULT: '#D4AF37',
          light: '#E5C766',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
export default config
