/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#E8D5A3',
          400: '#D4B96A',
          500: '#C9A84C',
          600: '#B8962E',
          700: '#966F1E',
        },
      },
    },
  },
  plugins: [],
}
