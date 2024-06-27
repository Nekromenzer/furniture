/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        heroHome: "url('/public/assets/images/hero.jpeg')",
      },
    },
  },
  plugins: [],
};
