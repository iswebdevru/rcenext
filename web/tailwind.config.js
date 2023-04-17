const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
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
        'notification-in': {
          '0%': {
            opacity: 0,
            transform: 'scale(0.85) translateY(30%)',
          },
          '100%': {
            transform: 'scale(1) translateY(0%)',
            opacity: 100,
          },
        },
        'notification-out': {
          '0%': {
            opacity: 100,
            transform: 'scale(1) translateX(0%)',
          },
          '100%': {
            transform: 'scale(0.85) translateX(100%)',
            opacity: 0,
          },
        },
      },
      animation: {
        appear: 'appear 0.1s ease-in-out 1',
        'notification-add': 'notification-in 0.2s ease-in 1 forwards',
        'notification-remove': 'notification-out 0.5s ease-out 1 forwards',
      },
    },
  },
  plugins: [],
};
