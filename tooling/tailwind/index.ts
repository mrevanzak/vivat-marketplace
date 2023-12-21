import type { Config } from "tailwindcss";

import colors from "@vivat/color-palette";

export default {
  content: [""],
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [],
} satisfies Config;
