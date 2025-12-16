import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          950: '#0A0A0B',
          900: '#121214',
          800: '#202022',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#f7cf3f',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        type: {
          50: '#F2F2F0',
          100: '#A1A1AA',
          200: '#E2D9C8',
        },
        glass: {
          10: 'rgba(255, 255, 255, 0.1)',
          5: 'rgba(255, 255, 255, 0.05)',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'vignette': 'radial-gradient(circle at center, transparent 0%, #0A0A0B 120%)',
        'gradient-gold': 'linear-gradient(135deg, #f7cf3f 0%, #eab308 50%, #ca8a04 100%)',
        'gradient-gold-radial': 'radial-gradient(circle at center, #f7cf3f 0%, #eab308 50%, transparent 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(247, 207, 63, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(247, 207, 63, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(247, 207, 63, 0.2) 0px, transparent 50%)',
        'gradient-animated': 'linear-gradient(45deg, #000000, #f7cf3f, #000000, #eab308)',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(255, 255, 255, 0.05)',
        'glow-md': '0 0 40px rgba(255, 255, 255, 0.08)',
        'glow-gold': '0 0 30px rgba(247, 207, 63, 0.3)',
        'glow-gold-lg': '0 0 50px rgba(247, 207, 63, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
