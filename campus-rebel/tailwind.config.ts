import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B82F6',    // Electric Blue
          secondary: '#7C3AED',  // Vibrant Purple
          accent: '#06B6D4',     // Turquoise
          coral: '#F87171',      // Sunset Coral
          yellow: '#FACC15',     // Neon Yellow
          dark: '#0F0F0F',       // Dark Charcoal
          gray: '#1E1E1E',       // Graphite Gray
        },
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #3B82F6, #7C3AED)',
        'dark-gradient': 'linear-gradient(135deg, #0F0F0F, #1E1E1E)',
      },
    },
  },
  plugins: [],
} satisfies Config;