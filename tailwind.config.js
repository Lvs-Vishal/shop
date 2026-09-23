/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F14",
        surface: "#141A21",
        border: "#1F2933",
        cyan: {
          accent: "#22D3EE"
        },
        status: {
          healthy: "#10B981", // Emerald
          warning: "#F59E0B", // Amber
          critical: "#F43F5E", // Rose
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
