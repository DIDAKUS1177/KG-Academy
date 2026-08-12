import type { Config } from "tailwindcss";

/**
 * Paleta extraida directamente del logotipo oficial de
 * KATERINE GUANARITA - KG GESTION INTEGRAL S.A.S.
 *   navy  #0A2D4D  (letra K, casco, tipografia)
 *   lime  #8FBF16  (letra G, estetoscopio, acentos)
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EDF3F9",
          100: "#D6E4F0",
          200: "#A9C4DD",
          300: "#7BA3C9",
          400: "#3F6E9B",
          500: "#1B4A73",
          600: "#123C61",
          700: "#0A2D4D",
          800: "#07223A",
          900: "#051828",
          950: "#030F1A",
        },
        lime: {
          50: "#F5FAE6",
          100: "#E9F4C8",
          200: "#D4E993",
          300: "#BCDD5A",
          400: "#A5CE30",
          500: "#8FBF16",
          600: "#759F11",
          700: "#5C7D0E",
          800: "#455E0B",
          900: "#2F4107",
        },
        ink: "#0B1620",
        cloud: "#F6F8FB",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        kg: "0 18px 40px -18px rgba(10,45,77,0.35)",
        "kg-lg": "0 30px 70px -25px rgba(10,45,77,0.45)",
        glow: "0 0 0 4px rgba(143,191,22,0.18)",
      },
      backgroundImage: {
        "kg-gradient": "linear-gradient(135deg,#0A2D4D 0%,#123C61 45%,#1B4A73 100%)",
        "kg-lime": "linear-gradient(135deg,#8FBF16 0%,#A5CE30 100%)",
        "kg-mesh":
          "radial-gradient(at 12% 18%, rgba(143,191,22,0.22) 0px, transparent 55%), radial-gradient(at 88% 8%, rgba(27,74,115,0.35) 0px, transparent 50%), radial-gradient(at 70% 92%, rgba(143,191,22,0.14) 0px, transparent 45%)",
        grid: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "draw-ring": {
          "0%": { strokeDashoffset: "999" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.16,1,.3,1) both",
        "fade-in": "fade-in .8s ease both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "draw-ring": "draw-ring 1.2s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
