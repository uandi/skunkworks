// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 0.7s steps(1, start) infinite',
      },
      colors: {
        // Text Colors
        white: '#FFFFFF',
        'gray-light': '#F5F5F7',
        'gray-light-alpha': 'rgba(255, 255, 255, 0.92)',
        'gray-secondary': '#86868B',
        'gray-secondary-alpha': 'rgba(255, 255, 255, 0.56)',
        'gray-secondary-alt': '#D2D2D7',
        'gray-secondary-alt-alpha': 'rgba(255, 255, 255, 0.8)',
        'gray-tertiary': '#6E6E73',
        'gray-tertiary-alpha': 'rgba(255, 255, 255, 0.4)',

        // Accent Colors
        blue: '#2997FF',
        orange: '#FF791B',
        green: '#03A10E',
        red: '#FF3037',

        // Fill/Background Colors
        black: '#000000',
        'fill-secondary': '#161617',
        'fill-tertiary': '#1D1D1F',

        // Specific Fill Colors (based on purpose)
        'fill-gray': '#F5F5F7',
        'fill-gray-secondary': '#6E6E73',
        'fill-gray-tertiary': '#424245',
        'fill-gray-quaternary': '#333336',
        'fill-orange-secondary': '#290D00',
        'fill-green-secondary': '#002B03',
        'fill-red-secondary': '#330000',
        'fill-yellow-secondary': '#2B3200',

        // Modal Specific Colors
        'modal-scrim': 'rgba(50, 50, 50, 0.48)',
        'modal-close-bg': '#333336',
        'modal-close-hover': '#37373a',
        'modal-close-active': '#2f2f32',
        'modal-close-color': 'rgba(255, 255, 255, 0.8)',
        'modal-close-hover-color': '#FFFFFF',

        // Finish Colors
        'silver-new': '#AAABAD',
        'space-black': '#1B1A1C',
        'blue': '#A0AEAE',
        'purple': '#ADA9B4',
       ' starlight': '#B0AAA2',
        'space-gray-new': '#3D3A40',
      },
      fontFamily: {
        'code': ['JetBrains Mono', 'monospace'], 
      },
    },
  },
  plugins: [],
}