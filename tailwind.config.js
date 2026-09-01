/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        adelina: {
          dark: '#141414',
          gray: '#222222',
          muted: '#666666',
          light: '#F8F7F4',
          sand: '#EFECE6',
          accent: '#C5A880', // Gold/Sand luxury accent
          gold: '#B89B72',
          card: '#FFFFFF',
          border: '#E2DFD8',
        }
      }
    },
  },
  plugins: [],
}
