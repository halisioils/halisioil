import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "767px",
        lg: "991px",
        xl: "1199px",
        mxl: "1440",
        xlg: "1919px",
      },
      colors: {
        primary: "#5542F6",
        highlight: "#eae8fb",
        bgGray: "#fbfafd",
      },
    },
  },
  plugins: [],
} satisfies Config;
