/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#133E87",
        secondary: "#608BC1",
        third: "#B3D7ED",
        fourth: "#F3F3E0",
      },
    },
  },
  plugins: [],
};
