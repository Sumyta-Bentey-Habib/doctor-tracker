export const THEME_COLORS = {
  primary: '#4f6df5',
  primaryDark: '#405de0',
  primaryLight: '#e9edff',
  sidebar: '#17243b',
  background: '#f7f8fc',
  gridBorder: '#edf0f5',
  mutedText: '#98a1b2',
  slateText: '#64748b',
} as const;

export type ThemeColors = typeof THEME_COLORS;

