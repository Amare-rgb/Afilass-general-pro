/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#f2f8f6',
          100: '#dfeee8',
          200: '#b9dcd0',
          300: '#8dc4b1',
          400: '#5fa891',
          500: '#3c8b76',
          600: '#2c6f5e',
          700: '#0f6e5f', // primary
          800: '#124d42',
          900: '#0f3e36',
        },
        clay: {
          500: '#c07a4e',
          600: '#a5613a',
        },
        ink: '#1f2933',
        parchment: '#f7f5f0',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
};
