import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f9',
          100: '#d9f2f2',
          200: '#b3e6e6',
          300: '#8cd9d9',
          400: '#66cdcd',
          500: '#40c0c0',
          600: '#339999',
          700: '#267373',
          800: '#1a4d4d',
          900: '#0d2626',
        },
        secondary: {
          50: '#e6f4ea',
          100: '#cce9d5',
          200: '#99d3ab',
          300: '#66bd81',
          400: '#33a757',
          500: '#00912d',
          600: '#007424',
          700: '#00571b',
          800: '#003a12',
          900: '#001d09',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
