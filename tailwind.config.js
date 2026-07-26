/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        primary: {
          DEFAULT: "var(--text-primary)",
          foreground: "var(--background)",
        },
        secondary: {
          DEFAULT: "var(--text-secondary)",
          light: "#9B9B9B",
        },
        accent: {
          DEFAULT: "#4F46E5",
          muted: "#EEF2FF",
          soft: "#F5F3FF",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#16A34A",
          muted: "#F0FDF4",
          soft: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#B45309",
          muted: "#FFFBEB",
          soft: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626",
          muted: "#FEF2F2",
          soft: "#FEE2E2",
        },
        vault: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#09090B",
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Helvetica Neue",
          "sans-serif"
        ],
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont", 
          "SF Pro Display",
          "sans-serif"
        ],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px", letterSpacing: "0.02em" }],
        "xs": ["12px", { lineHeight: "16px" }],
        "sm": ["13px", { lineHeight: "20px" }],
        "base": ["15px", { lineHeight: "24px" }],
        "lg": ["17px", { lineHeight: "28px" }],
        "xl": ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
      },
      borderRadius: {
        "sm": "6px",
        "DEFAULT": "8px",
        "md": "10px",
        "lg": "12px",
        "xl": "14px",
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        "soft": "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
        "card": "0 2px 8px -2px rgba(0,0,0,0.06), 0 1px 3px -1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px -6px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)",
        "modal": "0 24px 64px -12px rgba(0,0,0,0.18), 0 8px 24px -6px rgba(0,0,0,0.10)",
        "sidebar": "1px 0 0 0 #E8E8E8",
        "focus": "0 0 0 3px rgba(79,70,229,0.12)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "sidebar": "240px",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        "skeleton": "skeleton 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        skeleton: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
}
