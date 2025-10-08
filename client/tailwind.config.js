/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#6f4cff',        // primary action color (replaces dark purple)
        brandAccent: '#6f4cff',  // same color for consistency
        brandHover: '#6f4cff',   // same color for hover/active
        brandText: '#E8E5FF',    // light text for contrast on dark bg
        primary: '#6f4cff',      // electric violet (was dark purple)
        primaryAccent: '#6f4cff', // electric violet accent
        textPrimary: '#E6E2F3', // light text on dark
        textMuted: '#A29BBF',
        // Beta notice red colors
        betaRedBg: '#fee2e2',    // light red background
        betaRedText: '#b91c1c',  // dark red text
        betaRedBorder: '#fecaca', // red border
        secondary: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        success: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        dark: {
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        'gaming': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-card': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}