import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                plex: ["var(--font-plex)", "IBM Plex Mono", "monospace"],
                inter: ["var(--font-inter)", "Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;
