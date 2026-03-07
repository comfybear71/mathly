import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B35",
          50: "#FFF3ED",
          100: "#FFE4D4",
          200: "#FFC4A8",
          300: "#FF9B71",
          400: "#FF6B35",
          500: "#F04E1A",
          600: "#D13A0E",
          700: "#AC2D0E",
          800: "#8A2613",
          900: "#712313",
        },
        secondary: {
          DEFAULT: "#4ECDC4",
          50: "#EDFBFA",
          100: "#D2F5F2",
          200: "#AAEBE5",
          300: "#73DBD3",
          400: "#4ECDC4",
          500: "#28B0A6",
          600: "#1D8D86",
          700: "#1C716C",
          800: "#1C5A57",
          900: "#1B4B49",
        },
        accent: {
          DEFAULT: "#FFE66D",
          50: "#FFFDE5",
          100: "#FFF9C4",
          200: "#FFF38E",
          300: "#FFE66D",
          400: "#FFD60A",
          500: "#EFC100",
          600: "#CE9700",
          700: "#A46C02",
          800: "#88540A",
          900: "#73440F",
        },
        success: "#06D6A0",
        error: "#EF476F",
        background: {
          light: "#FAFAFA",
          dark: "#1A1A2E",
        },
        foreground: "var(--foreground)",
      },
      fontFamily: {
        heading: ["var(--font-nunito)", "sans-serif"],
        body: ["var(--font-source-sans)", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "bounce-in": "bounce-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "confetti": "confetti 1s ease-out",
        "float": "float 3s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(255, 107, 53, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.8)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "confetti": {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(-100px) rotate(720deg)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
