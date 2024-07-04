import { Config as DaisyConfig } from "daisyui";
import { Config as TailwindConfig } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: TailwindConfig = {
  content: [],
  theme: {
    extend: {
      keyframes: {
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-out-left": {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-100%)" },
        },
        "slide-down": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        shine: {
          "0%": { backgroundPosition: "-100% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "fade-in-left": "fade-in-left 0.5s ease-in-out",
        "fade-out-left": "fade-out-left 0.5s ease-in-out",
        "slide-down": "slide-down 0.5s ease-in-out",
        "slide-up": "slide-up 0.5s ease-in-out",
        shine: "shine 6s linear infinite",
      },
      fontFamily: {
        sans: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
        body: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
        title: [
          "var(--font-title)",
          "var(--font-body)",
          ...defaultTheme.fontFamily.sans,
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: <DaisyConfig>{
    darkTheme: "spinspotdark",
    themes: [
      {
        spinspot: {
          primary: "#02415a",
          "primary-content": "#ffffff",
          secondary: "#6f3a82",
          "secondary-content": "#ffffff",
          accent: "#5b2bca",
          "accent-content": "#ffffff",
          neutral: "#427aa1",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#EBF2FA",
          "base-300": "#c0c6ce",
          info: "#53a6ea",
          success: "#0bad1e",
          warning: "#ff9900",
          error: "#d92020",
        },
        spinspotdark: {
          primary: "#530b6f",
          "primary-content": "#ffffff",
          secondary: "#1B50A0",
          "secondary-content": "#ffffff",
          accent: "#5b2bca",
          "accent-content": "#ffffff",
          neutral: "964AB1",
          "neutral-content": "#ffffff",
          "base-100": "#0F172A",
          "base-200": "#526389",
          "base-300": "#ffffff",
          info: "#53a6ea",
          success: "#0bad1e",
          warning: "#ff9900",
          error: "#d92020",
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};

export default config;
