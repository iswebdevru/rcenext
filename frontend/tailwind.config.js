const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
      },
      fontFamily: {
        sans: ["var(--font-main)", ...fontFamily.sans],
      },
      container: {
        center: true,
        padding: "16px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
