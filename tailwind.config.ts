import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        page: "1350px"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        calsans: ['var(--font-calsans)']
      },
      animation: {
        "xpPopup": 'xpPopup 1.5s ease-in-out forwards',
        "feedbackPopup": 'feedbackPopup 1.5s ease-in-out forwards',
        "fadeOut": 'fadeOut 1.5s ease-in forwards',
      },
      keyframes: {
        xpPopup: {
          '0%': { transform: 'translateY(0)', opacity: "0" },
          '50%': { transform: 'translateY(-1rem)', opacity: "1" },
          '100%': { transform: 'translateY(-2rem)', opacity: "0" },
        },
        feedbackPopup: {
          '0%': {  opacity: "0" },
          '1%': {  opacity: "1" },
          '10%': {  opacity: "0" },
          '11%': {  opacity: "1" },
          '50%': {  opacity: "1" },
          '100%': {  opacity: "0" },
        },
        fadeOut: {
          '0%': {  opacity: "1" },
          '100%': { opacity: "0" },
        },
      }
    },
  },
  plugins: [],
};
export default config;