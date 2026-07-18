/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07090C',
          900: '#0A0C10',
          850: '#0D1015',
          800: '#12151C',
          700: '#181C25',
          600: '#232833',
          500: '#343B49',
        },
        mist: {
          400: '#5B6478',
          300: '#8A93A6',
          200: '#B7BECB',
          100: '#E7E9EE',
          50: '#F5F7FA',
        },
        flow: {
          teal: '#34E7C4',
          blue: '#3E86F5',
          deep: '#1F3D8C',
        },
        gold: {
          DEFAULT: '#C9A24C',
          soft: '#E4C97A',
        },
        danger: '#F0625F',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'flow-gradient': 'linear-gradient(100deg, #34E7C4 0%, #3E86F5 100%)',
        'flow-gradient-soft': 'linear-gradient(100deg, rgba(52,231,196,0.15) 0%, rgba(62,134,245,0.15) 100%)',
        'grid-fade': 'radial-gradient(circle at 50% 0%, rgba(62,134,245,0.12), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(52, 231, 196, 0.15)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
      },
      keyframes: {
        flowmove: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        flowmove: 'flowmove 6s linear infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
