/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: '#700B10',
          'maroon-dark': '#52060A',
          'maroon-light': '#8A1117',
          'maroon-subtle': '#FFF5F5',
          gold: '#FDC656',
          'gold-light': '#FEE4AA',
          'gold-dark': '#D9981E',
          cream: '#FAF7F2',
          surface: '#F7F7F7',
          border: '#E6E6E6',
          dark: '#1C1917',
          muted: '#6B7280',
          green: '#25D366',
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(112, 11, 16, 0.12)',
        'drawer': '-4px 0 25px rgba(0, 0, 0, 0.15)',
        'nav': '0 2px 12px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
