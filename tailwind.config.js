const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          extend: "dark",
          colors: {
            background: "#0d1b2a",
            foreground: "#e8e8e2",
            primary: {
              DEFAULT: "#14b8a6",
              50: "#ccfbf1",
              100: "#99f6e4",
              200: "#5eead4",
              300: "#2dd4bf",
              400: "#14b8a6",
              500: "#0d9488",
              600: "#0f766e",
              700: "#115e59",
              800: "#134e4a",
              900: "#134e4a",
            },
            secondary: {
              DEFAULT: "#1b263b",
              50: "#e2e8f0",
              100: "#cbd5e1",
              200: "#94a3b8",
              300: "#64748b",
              400: "#475569",
              500: "#1b263b",
              600: "#1e293b",
              700: "#0f172a",
              800: "#0d1b2a",
              900: "#0a0f1a",
            },
            success: { DEFAULT: "#14b8a6" },
            warning: {
              DEFAULT: "#d4a853",
              50: "#fefce8",
              100: "#fef9c3",
              200: "#fef08a",
              300: "#fde047",
              400: "#facc15",
              500: "#d4a853",
              600: "#ca8a04",
              700: "#a16207",
              800: "#854d0e",
              900: "#713f12",
            },
            danger: { DEFAULT: "#dc2626" },
            // Sky blue (softer accents, issue card backgrounds)
            sky: {
              DEFAULT: "#7dd3fc",
              50: "#f0f9ff",
              100: "#e0f2fe",
              200: "#bae6fd",
              300: "#7dd3fc",
              400: "#38bdf8",
              500: "#0ea5e9",
              600: "#0284c7",
              700: "#0369a1",
              800: "#075985",
              900: "#0c4a6e",
            },
          },
        },
      },
      defaultTheme: "dark",
    }),
  ],
};
