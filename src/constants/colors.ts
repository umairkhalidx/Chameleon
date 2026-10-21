/**
 * Chameleon Color Palette & Theme Tokens
 * Sourced from documentation/colorPalette.md
 */

export const Palette = {
  softMint: "#F8FBF5",     // Very Soft Mint / Off-White background
  vibrantLime: "#A8E619",  // Vibrant Lime / Neon Green (Brand accent)
  forestOlive: "#283218",  // Deep Forest Olive / Dark Green
  pureWhite: "#FFFFFF",    // Pure White
  softLavender: "#D9C8FF", // Soft Lavender / Pastel Purple
  warmPeach: "#F2B880",    // Warm Pastel Peach / Coral
  deepNavy: "#243B64",     // Deep Navy Blue
  mutedCrimson: "#C94C4C", // Muted Crimson / Coral Red
} as const;

export const Colors = {
  // Theme Background & Surface
  background: Palette.softMint,
  surface: Palette.pureWhite,
  surfaceSubtle: "#F0F5EB",
  border: "#E2ECD7",

  // Brand Accents & Base Tones
  forestOlive: Palette.forestOlive,
  softMint: Palette.softMint,
  pureWhite: Palette.pureWhite,
  primary: Palette.vibrantLime,
  primaryForeground: Palette.forestOlive,
  secondary: Palette.forestOlive,

  // Typography
  textPrimary: Palette.forestOlive,
  textSecondary: "#52623F",
  textMuted: "#869674",
  textInverse: Palette.pureWhite,

  // Tab Navigation
  tabBarBackground: Palette.pureWhite,
  tabBarBorder: "#E6EFE0",
  tabActive: Palette.forestOlive,
  tabInactive: "#8D9D7C",
  tabActiveIndicator: Palette.vibrantLime,

  // Status & Accents
  accentLavender: Palette.softLavender,
  accentPeach: Palette.warmPeach,
  accentNavy: Palette.deepNavy,
  accentCrimson: Palette.mutedCrimson,
} as const;

