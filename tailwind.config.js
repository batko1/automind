/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#1a1a2e',
        gold: {
          DEFAULT: '#C8A45C',
          light: '#E8D5A3',
          dark: '#9C7E3C',
          50: '#FBF7EE',
          100: '#F3EBD4',
          200: '#E8D5A3',
        },
        subtle: '#8c8c9a',
        muted: '#b0b0be',
        border: '#e8e8ed',
        surface: '#f8f8fa',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display',
          'SF Pro Text', 'Helvetica Neue', 'Segoe UI', 'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
