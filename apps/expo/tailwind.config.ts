import type { Config } from "tailwindcss";

import baseConfig from "@vivat/tailwind-config";

import colors from "@/utils/colors";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      colors: colors,
    },
  },
} satisfies Config;
