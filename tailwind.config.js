/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#818CF8",
        secondary: "#34D399",
        accent: "#F59E0B",
        neutral: "#6B7280",
        "base-100": "#0F1115",
        "base-200": "#151821",
        "base-300": "#1C2028",
        "surface": "#242832",
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#818CF8",
          secondary: "#34D399",
          accent: "#F59E0B",
          neutral: "#6B7280",
          "base-100": "#0F1115",
          "base-200": "#151821",
          "base-300": "#1C2028",
          "surface": "#242832",
        },
      },
    ],
  },
}

