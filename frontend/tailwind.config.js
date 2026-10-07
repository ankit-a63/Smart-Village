/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0a3654',
        },
        saffron: {
          400: '#ff9933',
          500: '#ff8000',
          600: '#e67300',
        },
        village: {
          emerald: '#059669',
          amber: '#d97706',
          slate: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Hind', 'Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.4))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}
