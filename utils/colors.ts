export const THEME_COLORS = {
  // Brand accents inspired by the modern glassmorphism design
  primary: '#7c5cfc',
  primaryHover: '#6a4aee',
  primaryDark: '#5c38e2',
  primaryLight: '#f3f0ff',
  primaryMuted: '#e9e5ff',
  primaryBorder: '#dcd3ff',

  // Surfaces & Backgrounds
  background: '#f6f7fb',
  backgroundDark: '#0c0f17',
  surface: '#ffffff',
  surfaceDark: '#131824',
  surfaceMuted: '#f8fafc',
  surfaceMutedDark: '#1b2234',
  sidebar: '#17243b',
  sidebarDark: '#0e1320',

  // Borders
  gridBorder: '#edf0f5',
  borderDark: '#232c40',
  borderSubtle: '#e2e8f0',
  glassBorderLight: 'rgba(255, 255, 255, 0.7)',
  glassBorderDark: 'rgba(255, 255, 255, 0.08)',

  // Typography
  foreground: '#111827',
  foregroundDark: '#f9fafb',
  mutedText: '#98a1b2',
  mutedTextDark: '#6b7280',
  slateText: '#64748b',
  slateTextDark: '#94a3b8',

  // Semantic
  success: '#10b981',
  successLight: '#d1fae5',
  danger: '#f43f5e',
  dangerLight: '#ffe4e6',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  // Charts
  chartViolet: '#7c5cfc',
  chartVioletLight: '#c4b5fd',
  chartLilac: '#ddd6fe',
  chartGridLight: '#f1f5f9',
  chartGridDark: '#1e2638',
} as const;

export type ThemeColors = typeof THEME_COLORS;
