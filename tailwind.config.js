module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'air-green': '#10B981',
        'air-yellow': '#F59E0B',
        'air-orange': '#F97316',
        'air-red': '#EF4444',
        'dark-bg': '#1E1B4B',
        'card-bg': '#374151',
        'weather-bg': '#06B6D4',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
