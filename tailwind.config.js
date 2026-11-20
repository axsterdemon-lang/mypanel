/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        foreground: '#F0F0F5',
        primary: '#FF6B00',
        'primary-foreground': '#FFFFFF',
        secondary: '#1A1A2E',
        'secondary-foreground': '#F0F0F5',
        accent: '#FFD700',
        'accent-foreground': '#0A0A0F',
        muted: '#2A2A3E',
        'muted-foreground': '#8888AA',
        card: '#12121C',
        'card-foreground': '#F0F0F5',
        border: '#2A2A3E',
        input: '#1A1A2E',
        ring: '#FF6B00',
        electric: '#00D4FF',
      },
    },
  },
  plugins: [],
};
