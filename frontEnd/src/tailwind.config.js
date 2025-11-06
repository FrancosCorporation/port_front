/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: 'hsl(var(--accent-a9))',
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
      },
      borderRadius: {
        'xl': 'var(--radius-3)',
      },
    },
  },
  plugins: [],
};
