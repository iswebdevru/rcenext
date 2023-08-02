import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

export default {
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
} satisfies Config

