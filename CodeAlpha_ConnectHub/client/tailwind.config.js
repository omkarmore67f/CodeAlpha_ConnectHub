import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif']
      },
      colors: {
        ink: '#181716',
        paper: '#fbfaf7',
        line: '#e7e1d8',
        ember: '#df5b3f',
        moss: '#2f6b57',
        marine: '#24556b',
        plum: '#6c4b72'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(24, 23, 22, 0.08)'
      }
    }
  },
  plugins: [forms]
};
