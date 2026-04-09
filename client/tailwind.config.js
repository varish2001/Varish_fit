/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101418",
        slate: "#19222d",
        coral: "#ff6b35",
        mint: "#38d39f",
        fog: "#f2f6fa"
      },
      boxShadow: {
        glow: "0 10px 30px rgba(255,107,53,0.25)"
      }
    }
  },
  plugins: []
};
