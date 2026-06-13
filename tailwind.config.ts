import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef7ec",
          100: "#fce9c9",
          200: "#f8d28e",
          300: "#f4b653",
          400: "#f09e2b",
          500: "#e07d12",
          600: "#c2600d",
          700: "#a14a0f",
          800: "#823c13",
          900: "#6b3213",
        },
        ink: {
          DEFAULT: "#1f2933",
          light: "#52606d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
