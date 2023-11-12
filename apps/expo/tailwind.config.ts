import type { Config } from "tailwindcss";

import baseConfig from "@vivat/tailwind-config";
import { colors } from "@/utils/constant";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
      },
    },
  },
} satisfies Config;
