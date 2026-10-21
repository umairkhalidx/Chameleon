/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        doto: ["Doto_400Regular"],
        "doto-medium": ["Doto_500Medium"],
        "doto-semibold": ["Doto_600SemiBold"],
        "doto-bold": ["Doto_700Bold"],
        "doto-extrabold": ["Doto_800ExtraBold"],
        "doto-black": ["Doto_900Black"],
      },
      colors: {
        brand: {
          bg: "#F8FBF5",
          primary: "#A8E619",
          olive: "#283218",
          white: "#FFFFFF",
          lavender: "#D9C8FF",
          peach: "#F2B880",
          navy: "#243B64",
          crimson: "#C94C4C",
        },
      },
    },
  },
  plugins: [],
};
