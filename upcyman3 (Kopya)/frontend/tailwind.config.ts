import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ana renkler
        brand: {
          // Yeşil tonları (sürdürülebilirlik ve geri dönüşümü temsil eder)
          green: {
            50: '#E6F5E6',
            100: '#C2E5C2',
            200: '#9ED49E',
            300: '#7AC47A',
            400: '#56B356',
            500: '#32A332', // Ana marka yeşili
            600: '#2B8C2B',
            700: '#247524',
            800: '#1D5E1D',
            900: '#164716'
          },
          // Mavi tonları (profesyonellik ve teknolojiyi temsil eder)
          blue: {
            50: '#E6F0F9',
            100: '#CCE0F3',
            200: '#99C2E6',
            300: '#66A3DA',
            400: '#3385CD',
            500: '#0066C1', // Ana marka mavisi
            600: '#0052A3',
            700: '#003D7A',
            800: '#002952',
            900: '#001429'
          }
        },
        // Nötr renkler
        neutral: {
          850: '#1F2937' // Koyu arka plan için
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace']
      },
      fontSize: {
        // Özel font boyutları
        'heading-1': ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
        'heading-2': ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        'heading-3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.75rem' }],
        'body': ['1rem', { lineHeight: '1.5rem' }],
        'body-small': ['0.875rem', { lineHeight: '1.25rem' }]
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
