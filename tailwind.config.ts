import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#592C82',
          hover: '#4A2569',
        },
        secondary: {
          DEFAULT: '#F2C100',
        },
        text: {
          main: '#1A1A1A',
          secondary: '#64748B',
        },
        background: {
          DEFAULT: '#FFFFFF',
          gray: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

