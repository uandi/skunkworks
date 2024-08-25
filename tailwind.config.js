// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'background-dark': '#1a1a1a',
        'primary-text': '#f0f0f0',
        'secondary-text': '#a0a0a0',
        'accent': '#6b46c1', // Example purple accent color
        'accent-hover': '#805ad5',
      },
      fontFamily: {
        'code': ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}