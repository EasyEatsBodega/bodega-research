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
        // Background colors
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Bodega brand colors
        bodega: {
          gold: "#F0A202",
          orange: "#F18805",
          coral: "#D95D39",
          navy: "#202C59",
          burgundy: "#581F18",
        },

        // Surface colors
        surface: {
          primary: "#0A0A0A",
          secondary: "#141414",
          tertiary: "#1A1A1A",
          elevated: "#1F1F1F",
        },

        // Border colors
        border: {
          DEFAULT: "#262626",
          light: "#333333",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      animation: {
        "print": "print 2s ease-in-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        print: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(240, 162, 2, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(240, 162, 2, 0.6)" },
        },
      },
      boxShadow: {
        "glow-gold": "0 0 20px rgba(240, 162, 2, 0.3)",
        "glow-orange": "0 0 20px rgba(241, 136, 5, 0.3)",
        "glow-coral": "0 0 20px rgba(217, 93, 57, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
