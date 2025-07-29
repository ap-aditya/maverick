export const THEME_COLORS = {
  primary: "#3b82f6",
  secondary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
  teal: "#14b8a6",
  orange: "#f97316",
} as const;

export const COMPANY_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
] as const;

export const PIE_COLORS = [
  THEME_COLORS.primary,
  THEME_COLORS.success,
  THEME_COLORS.warning,
  THEME_COLORS.danger,
  THEME_COLORS.purple,
  THEME_COLORS.pink,
  THEME_COLORS.teal,
  THEME_COLORS.orange,
] as const;

export const toPercent = (score: number, scale: number): number =>
  (score / scale) * 100;

export const normalizeCompanyName = (name: string): string =>
  name.toLowerCase().trim();
