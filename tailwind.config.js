/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1a9a6c",
          dark: "#1e3d2e",
          yellow: "#f5b700",
        }
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        heading: ['"Inter"', "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
      },

      backgroundImage: {
        'mesh-gradient': "radial-gradient(ellipse 90% 70% at top left, #B2FBE0 0%, transparent 65%), radial-gradient(ellipse 90% 70% at top right, #B9FCF3 0%, transparent 65%), radial-gradient(ellipse 90% 60% at bottom left, #F2F5E0 0%, transparent 60%), radial-gradient(ellipse 90% 60% at bottom right, #EEF4F0 0%, transparent 60%)",
      },
      borderRadius: {
        'brand': '10px',
      },
    },
  },
  plugins: [],
}