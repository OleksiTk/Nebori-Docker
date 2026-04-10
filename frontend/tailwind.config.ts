import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nebori: {
          bg: "#0f1117",
          panel: "#15151F",
          panelSoft: "#161922",
          border: "#2a2f3a",
          text: "#f4f7ff",
          muted: "#888888",
          accent: "#f5c518"
        }
      },
      boxShadow: {
        panel: "0 10px 24px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
