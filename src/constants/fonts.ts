/**
 * Typography constants for Chameleon.
 * Provides type-safe access to custom loaded fonts across the application.
 */
export const Fonts = {
  doto: {
    thin: "Doto_100Thin",
    extraLight: "Doto_200ExtraLight",
    light: "Doto_300Light",
    regular: "Doto_400Regular",
    medium: "Doto_500Medium",
    semiBold: "Doto_600SemiBold",
    bold: "Doto_700Bold",
    extraBold: "Doto_800ExtraBold",
    black: "Doto_900Black",
  },
} as const;

export type DotoWeight = keyof typeof Fonts.doto;
