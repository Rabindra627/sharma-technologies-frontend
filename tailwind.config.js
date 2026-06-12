/** @type {import('tailwindcss').Config} */
module.exports = {
 content: ["./src/**/*.{js,jsx}"],
  theme: {
     extend: {
      colors: {
        brand: '#1e40af',   // blue
        accent: '#a21caf',  // purple
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.10)',
      }
    },
  },
  plugins: [],
};
