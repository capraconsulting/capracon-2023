/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
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
