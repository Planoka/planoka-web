import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /** Orange Planoka — JAMAIS modifié */
        primary: {
          50: "#FDF0E6",
          100: "#FDDEC8",
          300: "#F5A96B",
          500: "#E8610A", /**  PRIMARY */
          600: "#CF5208",
          700: "#A84208",
          800: "#7A3205",
          950: "#4A1D02",
          DEFAULT: "#E8610A",
        },
        /** Neutres — Palette Ink */
        ink: {
          50: "#F7F7F5",
          100: "#E8E8E8",
          300: "#A8A8A8",
          500: "#6B6B6B",
          700: "#3D3D3D",
          900: "#1A1A1A",
          950: "#0F0F0F",
        },
        /** Fond crème chaud */
        cream: "#F5F0E8",
        /** Sémantiques */
        success: "#12A05C",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        /** Catégories */
        category: {
          restauration: "#E8610A",
          loisirs: "#7C3AED",
          sorties: "#059669",
          shopping: "#DC2626",
          services: "#2563EB",
          sante: "#DB2777",
          education: "#D97706",
          sport: "#0891B2",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        display: ["48px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        h1: ["32px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "1.35", fontWeight: "600" }],
        h4: ["16px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-l": ["16px", { lineHeight: "1.65" }],
        "body-m": ["14px", { lineHeight: "1.6" }],
        "body-s": ["13px", { lineHeight: "1.55" }],
        caption: ["11px", { lineHeight: "1.4", letterSpacing: "0.06em", fontWeight: "500" }],
        "overlay-xl": ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "overlay-l": ["20px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px",
      },
      height: {
        navbar: "64px",
        tabbar: "72px",
        sidebar: "240px",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },
      boxShadow: {
        tabbar: "0 -4px 24px rgba(0,0,0,0.08)",
        card: "0 1px 3px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
