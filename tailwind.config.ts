import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "vs-background": "var(--vs-background)",
        "vs-background-secondary": "var(--vs-background-secondary)",
        "vs-background-tertiary": "var(--vs-background-tertiary)",
        "vs-foreground": "var(--vs-foreground)",
        "vs-foreground-secondary": "var(--vs-foreground-secondary)",
        "vs-foreground-muted": "var(--vs-foreground-muted)",
        "vs-heading": "var(--vs-heading)",
        "vs-primary": "var(--vs-primary)",
        "vs-primary-light": "var(--vs-primary-light)",
        "vs-primary-dark": "var(--vs-primary-dark)",
        "vs-accent": "var(--vs-accent)",
        "vs-accent-light": "var(--vs-accent-light)",
        "vs-success": "var(--vs-success)",
        "vs-warning": "var(--vs-warning)",
        "vs-error": "var(--vs-error)",
      },
      borderColor: {
        "vs-border": "var(--vs-border)",
        "vs-border-light": "var(--vs-border-light)",
      },
    },
  },
  plugins: [],
};
export default config;
