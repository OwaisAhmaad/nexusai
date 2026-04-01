import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#E8521A',
        'accent-hover': '#d04415',
        'accent-light': '#fff0eb',
        background: '#F5F4F0',
        surface: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#374151',
        muted: '#6B7280',
        'muted-light': '#9CA3AF',
        border: '#E5E5E5',
        'border-hover': '#D1D5DB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.08)',
        'accent': '0 4px 14px rgba(232, 82, 26, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
