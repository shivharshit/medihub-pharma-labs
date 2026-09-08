/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0284c7', // vibrant cyan/medical blue from logo
          'blue-dark': '#0369a1',
          'blue-light': '#e0f2fe',
          green: '#22c55e', // fresh vibrant green from logo
          'green-dark': '#16a34a',
          'green-light': '#dcfce7',
          dark: '#0f172a',
          slate: '#334155',
          navy: '#091e3a',
          accent: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(2, 132, 199, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(2, 132, 199, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
