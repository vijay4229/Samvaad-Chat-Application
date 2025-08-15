/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'bkg-dark': '#111827',        // Deep navy blue
        'bkg-light': '#1f2937',       // Lighter slate gray for containers
        'accent': '#4f46e5',         // Vibrant indigo for buttons
        'text-primary': '#f9fafb',      // Soft white for main text
        'text-secondary': '#9ca3af',   // Lighter gray for secondary text
        'border': '#4b5563',          // Muted gray for borders
      }
    },
  },
  plugins: [],
}