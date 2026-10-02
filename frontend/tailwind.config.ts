import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04050C',
          900: '#070818',
          800: '#0B0D22',
          700: '#12152E',
          600: '#1A1E3D',
          500: '#252A52',
        },
        brand: {
          violet: '#7C3AED',
          indigo: '#4F46E5',
          fuchsia: '#D946EF',
          pink: '#EC4899',
          cyan: '#22D3EE',
          sky: '#0EA5E9',
          emerald: '#10B981',
          lime: '#84CC16',
          amber: '#F59E0B',
          orange: '#FB7185',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      backgroundImage: {
        'mesh-1':
          'radial-gradient(at 12% 8%, rgba(124,58,237,0.42) 0px, transparent 55%), radial-gradient(at 82% 4%, rgba(34,211,238,0.32) 0px, transparent 50%), radial-gradient(at 68% 82%, rgba(217,70,239,0.30) 0px, transparent 52%), radial-gradient(at 18% 88%, rgba(16,185,129,0.22) 0px, transparent 48%)',
        'mesh-2':
          'radial-gradient(at 0% 0%, rgba(236,72,153,0.30) 0px, transparent 50%), radial-gradient(at 100% 20%, rgba(79,70,229,0.36) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(14,165,233,0.28) 0px, transparent 55%)',
        'grad-brand': 'linear-gradient(120deg, #7C3AED 0%, #4F46E5 32%, #22D3EE 68%, #10B981 100%)',
        'grad-warm': 'linear-gradient(120deg, #F59E0B 0%, #EC4899 55%, #7C3AED 100%)',
        'grad-cool': 'linear-gradient(120deg, #0EA5E9 0%, #22D3EE 45%, #84CC16 100%)',
        'grad-text': 'linear-gradient(100deg, #C4B5FD 0%, #22D3EE 38%, #F0ABFC 70%, #FDE68A 100%)',
        'grad-ring':
          'conic-gradient(from 180deg, #7C3AED, #4F46E5, #22D3EE, #10B981, #F59E0B, #EC4899, #7C3AED)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 70px -20px rgba(124,58,237,0.55)',
        'glow-cyan': '0 0 60px -12px rgba(34,211,238,0.55)',
        'glow-pink': '0 0 60px -12px rgba(236,72,153,0.55)',
        card: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 30px 60px -30px rgba(0,0,0,0.9)',
        lift: '0 30px 80px -30px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.08)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%,-4%,0) scale(1.06)' },
          '66%': { transform: 'translate3d(-3%,3%,0) scale(0.96)' },
        },
        'orb-drift': {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '50%': { transform: 'translate(40px,-30px) rotate(180deg)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'gradient-x': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '70%': { transform: 'scale(1.35)', opacity: '0' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'draw-line': { to: { strokeDashoffset: '0' } },
        'grow-bar': { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        'ticker-pulse': {
          '0%,100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 18s ease-in-out infinite',
        'orb-drift': 'orb-drift 26s ease-in-out infinite',
        aurora: 'aurora 14s ease infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        marquee: 'marquee 40s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        'spin-slower': 'spin-slow 40s linear infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2.4s infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        blink: 'blink 1.1s step-end infinite',
        'ticker-pulse': 'ticker-pulse 2.4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
