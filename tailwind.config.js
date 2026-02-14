/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./agents/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        sidebar: {
          DEFAULT: "oklch(var(--sidebar-background) / <alpha-value>)",
          foreground: "oklch(var(--sidebar-foreground) / <alpha-value>)",
          accent: "oklch(var(--sidebar-accent) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
          hover: "oklch(var(--primary-hover) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
          hover: "oklch(var(--secondary-hover) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
          hover: "oklch(var(--accent-hover) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "oklch(var(--success) / <alpha-value>)",
          foreground: "oklch(var(--success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "oklch(var(--warning) / <alpha-value>)",
          foreground: "oklch(var(--warning-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        'sans': ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Outfit", "sans-serif"],
        'heading': ["SF Pro Display", "Inter", "sans-serif"],
        'cinema': ['"Playfair Display"', 'serif'],
        'telugu': ['"Noto Sans Telugu"', 'sans-serif'],
      },
      borderRadius: {
        "4xl": "2.5rem",
        "5xl": "3rem",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        soft: "0 4px 12px -2px rgb(0 0 0 / 0.1)",
        medium: "0 8px 24px -4px rgb(0 0 0 / 0.15)",
        glow: "0 0 15px rgba(59, 130, 246, 0.5)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite linear',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 4s ease-in-out infinite',
      },
      keyframes: {
        'text-shimmer': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        glow: {
          'from': { 'box-shadow': '0 0 10px rgba(59, 130, 246, 0.2)' },
          'to': { 'box-shadow': '0 0 25px rgba(139, 92, 246, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" }
        }
      }
    }
  },
  plugins: [],
}

