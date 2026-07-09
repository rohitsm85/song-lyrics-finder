/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0b0d10',
          900: '#121417',
          800: '#1a1d21',
          700: '#24272c',
        },
      },
    },
  },
  plugins: [],
}

