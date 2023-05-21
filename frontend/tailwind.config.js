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
        'notification-add': {
          '0%': {
            opacity: 0,
            transform: 'scale(0.85) translateY(30%)',
          },
          '100%': {
            transform: 'scale(1) translateY(0%)',
            opacity: 100,
          },
        },
        'notification-remove': {
          '0%': {
            opacity: 100,
            transform: 'scale(1) translateX(0%)',
          },
          '100%': {
            transform: 'scale(0.85) translateX(100%)',
            opacity: 0,
          },
        },
        'table-data-show': {
          '0%': {
            opacity: 0,
            'max-height': 0,
          },
          '100%': {
            'max-height': '48px',
            'padding-top': '12px',
            'padding-bottom': '12px',
            opacity: 1,
          },
        },
        'table-data-hide': {
          '0%': {
            opacity: 1,
            'max-height': '48px',
            'padding-top': '12px',
            'padding-bottom': '12px',
          },
          '100%': {
            opacity: 0,
            'max-height': 0,
            'padding-top': 0,
            'padding-bottom': 0,
          },
        },
        blink: {
          '0%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },
        'table-data-blink-light': {
          '0%': {
            'background-color': 'rgb(241 245 249)',
          },
        },
        'table-data-blink-dark': {
          '0%': {
            'background-color': 'rgb(71 85 105)',
          },
        },
        'option-appear': {
          '0%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },
      },
      animation: {
        blink: 'blink 0.3s ease 1 both',
        'notification-add': 'notification-add 0.2s ease 1 both',
        'notification-remove': 'notification-remove 0.5s ease-out 1 both',
        'table-data-show': 'table-data-show 0.2s ease 1 both',
        'table-data-hide': 'table-data-hide 0.2s ease-out 1 both',
        'table-data-blink-light':
          'blink 0.3s ease 1 both, table-data-blink-light 0.6s ease 1 both',
        'table-data-blink-dark':
          'blink 0.3s ease 1 both, table-data-blink-dark 0.6s ease 1 both',
        'option-appear': 'option-appear 0.3s ease 1 both',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
