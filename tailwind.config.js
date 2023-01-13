/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      tablet: "481px",
      laptop: "1024px",
      desktop: "1280px",
    },
  },
  plugins: [],
};
