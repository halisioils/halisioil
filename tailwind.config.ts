import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#5542F6",
        highlight: "#eae8fb",
        bgGray: "#fbfafd",
      },
    },
  },
  plugins: [],
} satisfies Config;
