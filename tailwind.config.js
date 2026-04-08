/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le decimos a Tailwind en qué archivos tiene que buscar las clases CSS
  // para incluirlas en el bundle final. Si no está bien configurado,
  // Tailwind no genera ningún estilo.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

