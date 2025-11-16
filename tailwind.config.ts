import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        netflix: {
          red: "#E50914",
          black: "#000000",
          dark: "#141414",
          gray: {
            50: "#f9f9f9",
            100: "#e5e5e5",
            200: "#b3b3b3",
            300: "#808080",
            400: "#6d6d6d",
            500: "#4d4d4d",
            600: "#2f2f2f",
            700: "#1a1a1a",
            800: "#141414",
            900: "#000000",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
