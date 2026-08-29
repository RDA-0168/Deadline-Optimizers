/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          50: '#e8edf5',
          100: '#c5d0e6',
          200: '#9fb0d5',
          300: '#7890c4',
          400: '#5878b8',
          500: '#3860ac',
          600: '#2d508f',
          700: '#1e3560',
          800: '#162848',
          900: '#0d1b30',
          950: '#080f1c',
        },
        'rail-blue': {
          50: '#e3f0ff',
          100: '#b8d8ff',
          200: '#8abfff',
          300: '#5aa5ff',
          400: '#2d8fff',
          500: '#0070e0',
          600: '#0058b0',
          700: '#004080',
          800: '#002a54',
          900: '#001428',
        },
        'cyan-accent': {
          50: '#e0f9ff',
          100: '#b3f1ff',
          200: '#80e7ff',
          300: '#4dd9ff',
          400: '#1aceff',
          500: '#00b8e6',
          600: '#008fb3',
          700: '#006680',
          800: '#004054',
          900: '#001f28',
        },
        'slate-dark': {
          800: '#1a2332',
          850: '#141c28',
          900: '#0f1623',
          950: '#090e18',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
