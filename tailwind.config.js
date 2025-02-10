/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "selector",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        frontend: "#bbdde6",
        ledelse: "#651d32",
        "cloud-native": "#ffd2b9",
        background: "#fff",
        primary: {
          DEFAULT: "#0d0d1f",
          light: "#fafafc",
        },
      },
    },
    screens: {
      tablet: "481px",
      sm: "640px",
      md: "768px",
      laptop: "1024px",
      desktop: "1280px",
    },
  },
  plugins: [],
};
