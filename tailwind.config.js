/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sfpro' : ['SF Pro Rounded', 'sans-serif'],
      }
    },
  },
  plugins: [],
}