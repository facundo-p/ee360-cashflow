/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f1115',
        secondary: '#f2f3f5',
        ingreso: '#0a8f45',
        egreso: '#c62828',
        border: '#e1e3e8',
      },
      borderRadius: {
        xl: '12px',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};


