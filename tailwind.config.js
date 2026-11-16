/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050506',
        sidebar: '#0B0B0C',
        surface: {
          DEFAULT: '#111112',
          2: '#171718',
          3: '#1F1F21',
        },
        border: 'rgba(255, 255, 255, 0.07)',
        text: '#F4F4F5',
        'text-secondary': '#A1A1AA',
        'text-muted': '#6B6B75',
        primary: {
          DEFAULT: '#6C5CE7',
          light: '#A9A2FB',
          strong: '#5A49D6',
          soft: 'rgba(108, 92, 231, 0.14)',
        },
        success: {
          DEFAULT: '#22C55E',
          soft: 'rgba(34, 197, 94, 0.12)',
        },
        danger: '#F43F5E',
        warning: '#F59E0B',
        pink: '#D946EF',
        slate: '#94A3B8',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      borderRadius: {
        field: '10px',
        card: '16px',
        modal: '20px',
        badge: '6px',
        cell: '8px',
      },
      boxShadow: {
        glow: '0 8px 24px -6px rgba(108, 92, 231, 0.55)',
        'glow-soft': '0 0 32px -8px rgba(108, 92, 231, 0.35)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg, #7B6CF6 0%, #5F4BE8 100%)',
        'success-gradient': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'brand-gradient': 'linear-gradient(135deg, #7B6CF6 0%, #A9A2FB 100%)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(12px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'drawer-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-3px)' },
          '40%, 60%': { transform: 'translateX(3px)' },
        },
        'toast-progress': {
          from: { transform: 'scaleX(1)' },
          to: { transform: 'scaleX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out',
        'toast-in': 'toast-in 180ms ease-out',
        'modal-in': 'modal-in 180ms ease-out',
        'drawer-in': 'drawer-in 200ms ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        shake: 'shake 340ms ease-in-out',
        'toast-progress': 'toast-progress linear forwards',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
