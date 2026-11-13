/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: {
          DEFAULT: '#0A0A0A',
          subtle: '#121212',
          surface: '#181818',
          card: '#1F1F1F',
          border: '#2E2E2E',
          muted: '#8E8E93',
        },
        cerulean: {
          DEFAULT: '#007BA7',
          hover: '#00658A',
          light: '#2898C6',
          dark: '#005370',
          glow: 'rgba(0, 123, 167, 0.25)',
        },
        rose: {
          neon: '#FF2E63',
          'neon-hover': '#E01E53',
          'neon-light': '#FF5784',
          'neon-glow': 'rgba(255, 46, 99, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cerulean': '0 0 15px rgba(0, 123, 167, 0.35)',
        'glow-rose': '0 0 15px rgba(255, 46, 99, 0.35)',
        'card-hover': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
