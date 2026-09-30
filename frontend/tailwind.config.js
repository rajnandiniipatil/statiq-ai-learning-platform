/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#0B3A75',
          navy: '#062044',
          light: '#F0F5FA',
          accent: '#0284C7',
          orange: '#FF9933', // Tricolor national accent
          green: '#138808',  // Tricolor national green
        }
      }
    },
  },
  plugins: [],
}
