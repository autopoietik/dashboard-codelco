/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        codelco: {
          orange: '#D97828',
          slate: '#2F353B',
          gray: '#E5E7EB',
        },
        status: {
          success: '#10B981',
          danger: '#EF4444',
          neutral: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
