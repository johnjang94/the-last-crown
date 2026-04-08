import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["ui-serif", "Georgia", "serif"],
      },
      colors: {
        ink: "#0b0b10",
        parchment: "#f5efe1",
        accent: "#c8a24c",
        crimson: "#8a1c2b",
      },
      boxShadow: {
        glow: "0 0 40px rgba(200,162,76,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
