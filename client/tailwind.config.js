/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // High-fidelity palette from your image
        brand: {
          green: '#064E3B',    // Deep Emerald (Nav/Buttons)
          mint: '#10B981',     // Active State Green
          soft: '#ECFDF5',     // Background Wash
          slate: '#F8FAFC',    // App Background
          gold: '#F59E0B'      // Accent for Icons/Badges
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(6, 78, 59, 0.08)',
        'card': '0 2px 20px rgba(0, 0, 0, 0.04)'
      }
    },
  },
  plugins: [],
}