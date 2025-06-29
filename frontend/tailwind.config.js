/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Enables dark mode via class
  theme: {
    extend: {
      colors: {
        background: '#262626',      // main background color
        surface: '#1f1f1f',         // navbar / card base
        border: '#444',             // subtle border
        accent: '#3a3a3a',          // hover / highlight
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // modern sans-serif
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
