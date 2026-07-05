/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#171310',
          panel: '#221C16',
          raised: '#2B2319',
        },
        gold: {
          DEFAULT: '#C79A56',
          bright: '#E8C077',
          dim: '#8A6B3D',
        },
        cream: {
          DEFAULT: '#F2E9DC',
          muted: '#A79A87',
        },
        line: '#4A3D2E',
        status: {
          new: '#E8C077',
          accepted: '#6FA8DC',
          preparing: '#E0954D',
          ready: '#7CBB8B',
          served: '#8A8177',
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
