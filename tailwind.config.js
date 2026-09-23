/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F1117",
        surface: "#161B26",
        "surface-light": "#222840",
        border: "#252B3B",
        indigo: {
          accent: "#6366F1"
        },
        status: {
          healthy: "#10B981",
          warning: "#F59E0B",
          critical: "#F43F5E",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
