export type ColorPalette = {
  // Primary
  PRIMARY_MAIN: string;
  PRIMARY_LIGHT: string;

  // Secondary
  SECONDARY_MAIN: string;
  SECONDARY_LIGHT: string;
  SECONDARY_DARK: string;

  // Neutral (Grays)
  GRAY_50: string;
  GRAY_100: string;
  GRAY_200: string;
  GRAY_300: string;
  GRAY_400: string;
  GRAY_500: string;
  GRAY_600: string;
  GRAY_700: string;
  GRAY_800: string;
  GRAY_900: string;

  // Backgrounds
  BG_PAGE: string;
  BG_CARD: string;
  BG_HEADER: string;
  BG_SIDEBAR: string;

  // Text
  TEXT_MAIN: string;
  TEXT_SECONDARY: string;
  TEXT_MUTED: string;
  TEXT_INVERSE: string;

  // Status: Success
  SUCCESS_MAIN: string;
  SUCCESS_LIGHT: string;
  SUCCESS_DARK: string;

  // Status: Warning
  WARNING_MAIN: string;
  WARNING_LIGHT: string;
  WARNING_DARK: string;

  // Status: Error
  ERROR_MAIN: string;
  ERROR_LIGHT: string;
  ERROR_DARK: string;

  // Status: Info
  INFO_MAIN: string;
  INFO_LIGHT: string;
  INFO_DARK: string;

  // Borders
  BORDER_MAIN: string;
};

/**
 * Global Color Constants
 * Usage:
 * import { COLORS } from '../constants/Constant';
 * backgroundColor: COLORS.PRIMARY_MAIN
 */
export const COLORS: ColorPalette = {
  // Primary
  PRIMARY_MAIN: "#3B82F6",
  PRIMARY_LIGHT: "#EFF6FF",

  // Secondary
  SECONDARY_MAIN: "#64748B",
  SECONDARY_LIGHT: "#F8FAFC",
  SECONDARY_DARK: "#475569",

  // Neutral (Grays - Derived from Tailwind defaults mapping)
  GRAY_50: "#F8FAFC",
  GRAY_100: "#F1F5F9",
  GRAY_200: "#E2E8F0",
  GRAY_300: "#CBD5E1",
  GRAY_400: "#94A3B8",
  GRAY_500: "#64748B",
  GRAY_600: "#475569",
  GRAY_700: "#334155",
  GRAY_800: "#1E293B",
  GRAY_900: "#0F172A",

  // Backgrounds
  BG_PAGE: "#F8F9FB",
  BG_CARD: "#FFFFFF",
  BG_HEADER: "#1E293B",
  BG_SIDEBAR: "#FFFFFF",

  // Text
  TEXT_MAIN: "#1E293B",
  TEXT_SECONDARY: "#64748B",
  TEXT_MUTED: "#94A3B8",
  TEXT_INVERSE: "#FFFFFF",

  // Status: Success
  SUCCESS_MAIN: "#10B981", // Original green
  SUCCESS_LIGHT: "#DCFCE7", // badge-success bg
  SUCCESS_DARK: "#166534", // badge-success text

  // Status: Warning
  WARNING_MAIN: "#F59E0B", // Original orange
  WARNING_LIGHT: "#fef3c7", // badge-warning bg
  WARNING_DARK: "#854D0E", // badge-warning text

  // Status: Error
  ERROR_MAIN: "#EF4444", // Original red
  ERROR_LIGHT: "#FEE2E2", // badge-danger bg
  ERROR_DARK: "#991B1B", // badge-danger text

  // Status: Info
  INFO_MAIN: "#26acffff", // Info usually matches primary
  INFO_LIGHT: "#c7e8ffff",
  INFO_DARK: "#1E40AF",

  // Borders
  BORDER_MAIN: "#E2E8F0",
};

/**
 * Optional: Dark Theme structure overrides
 * You can merge these with COLORS depending on active theme context
 */
export const DARK_THEME_COLORS: Partial<ColorPalette> = {
  // Backgrounds
  BG_PAGE: "#0F172A",
  BG_CARD: "#1E293B",
  BG_HEADER: "#0F172A",
  BG_SIDEBAR: "#1E293B",

  // Text
  TEXT_MAIN: "#F8FAFC",
  TEXT_SECONDARY: "#94A3B8",
  TEXT_MUTED: "#64748B",
  TEXT_INVERSE: "#0F172A",

  // Borders
  BORDER_MAIN: "#334155",
};
