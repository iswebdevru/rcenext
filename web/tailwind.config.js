const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-main)', ...fontFamily.sans],
      },
      container: {
        center: true,
        padding: '16px',
      },
      keyframes: {
        appear: {
          '0%': {
            transform: 'translate(0%, 50%)',
            opacity: 0.5,
          },
          '100%': {
            transform: 'translate(0%, 0%)',
            opacity: 1,
          },
        },
      },
      animation: {
        appear: 'appear 0.3s ease-in-out 1',
      },
    },
  },
  plugins: [],
};
