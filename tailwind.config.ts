import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ink: "#f5f5f7",
        mute: "#86868b",
        glass: "rgba(255,255,255,0.08)",
      },
      boxShadow: {
        glass:
          "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
        lift: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.28)",
      },
      backgroundImage: {
        "glass-shine":
          "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 42%, rgba(255,255,255,0.02) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
