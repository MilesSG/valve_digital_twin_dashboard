/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A9EFF',
          light: '#6FB4FF',
          dark: '#2E7FE6'
        },
        success: {
          DEFAULT: '#52C41A',
          light: '#73D13D'
        },
        warning: {
          DEFAULT: '#FAAD14',
          light: '#FFC53D'
        },
        danger: {
          DEFAULT: '#FF4D4F',
          light: '#FF7875'
        },
        info: {
          DEFAULT: '#13C2C2',
          light: '#36CFC9'
        },
        offline: '#8C8C8C',
        text: {
          primary: '#FFFFFF',
          secondary: '#A0AEC0',
          tertiary: '#718096'
        },
        border: 'rgba(60, 120, 255, 0.2)',
        bg: {
          primary: '#0a0e27',
          secondary: '#1a1f3a',
          card: 'rgba(15, 27, 54, 0.8)'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(20, 35, 65, 0.9) 0%, rgba(15, 25, 50, 0.9) 100%)',
        'gradient-blue': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-green': 'linear-gradient(135deg, #52C41A 0%, #13C2C2 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FAAD14 0%, #FF4D4F 100%)',
        'gradient-purple': 'linear-gradient(135deg, #764ba2 0%, #F093FB 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(74, 158, 255, 0.5)',
        'glow-green': '0 0 20px rgba(82, 196, 26, 0.5)',
        'glow-red': '0 0 20px rgba(255, 77, 79, 0.5)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 15s ease-in-out infinite',
        'grid-move': 'gridMove 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(74, 158, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(74, 158, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(20px, -20px)' },
          '50%': { transform: 'translate(-20px, 20px)' },
          '75%': { transform: 'translate(20px, 20px)' },
        },
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      },
    },
  },
  plugins: [],
}